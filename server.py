"""
OBD-II Mechanic MCP Server

Provides tools for looking up OBD-II Diagnostic Trouble Codes (DTCs)
from a local SQLite database. Designed to be used as a stdio MCP server.

MCP config:
{
    "servers": {
        "obd2-mechanic": {
            "type": "stdio",
            "command": "python",
            "args": ["${workspaceFolder}/server.py"]
        }
    }
}
"""

import os
import sqlite3
from mcp.server.fastmcp import FastMCP

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "obd2_codes.db")

mcp = FastMCP("obd2-mechanic")


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@mcp.tool()
def lookup_dtc(code: str) -> str:
    """Look up an OBD-II Diagnostic Trouble Code (DTC).

    Args:
        code: The DTC code to look up (e.g. P0300, B1318, C0035, U0100).

    Returns:
        The code description, suggested fix, category, and severity.
    """
    code = code.strip().upper()
    conn = _get_connection()
    try:
        row = conn.execute(
            "SELECT code, description, suggested_fix, category, severity "
            "FROM dtc_codes WHERE code = ? LIMIT 1",
            (code,),
        ).fetchone()
        if row is None:
            return f"Code {code} not found in database."
        return (
            f"Code: {row['code']}\n"
            f"Category: {row['category']}\n"
            f"Severity: {row['severity']}\n"
            f"Description: {row['description']}\n"
            f"Suggested Fix: {row['suggested_fix']}"
        )
    finally:
        conn.close()


@mcp.tool()
def search_dtc(keyword: str) -> str:
    """Search for OBD-II codes by keyword in description or suggested fix.

    Args:
        keyword: The keyword to search for (e.g. 'misfire', 'oxygen sensor', 'catalytic').

    Returns:
        A list of matching DTC codes with descriptions (max 20 results).
    """
    keyword = keyword.strip()
    conn = _get_connection()
    try:
        rows = conn.execute(
            "SELECT code, description, category, severity FROM dtc_codes "
            "WHERE description LIKE ? OR suggested_fix LIKE ? "
            "ORDER BY code LIMIT 20",
            (f"%{keyword}%", f"%{keyword}%"),
        ).fetchall()
        if not rows:
            return f"No codes found matching '{keyword}'."
        lines = [f"Found {len(rows)} matching code(s):\n"]
        for row in rows:
            lines.append(
                f"  {row['code']} [{row['category']}/{row['severity']}] - {row['description']}"
            )
        return "\n".join(lines)
    finally:
        conn.close()


@mcp.tool()
def list_codes_by_category(category: str) -> str:
    """List all DTC codes in a given category.

    Args:
        category: The category to list — one of: Powertrain, Body, Chassis, Network.

    Returns:
        All codes in that category with their descriptions.
    """
    category = category.strip().capitalize()
    valid = {"Powertrain", "Body", "Chassis", "Network"}
    if category not in valid:
        return f"Invalid category '{category}'. Valid categories: {', '.join(sorted(valid))}"
    conn = _get_connection()
    try:
        rows = conn.execute(
            "SELECT code, description, severity FROM dtc_codes "
            "WHERE category = ? ORDER BY code",
            (category,),
        ).fetchall()
        if not rows:
            return f"No codes found in category '{category}'."
        lines = [f"{category} codes ({len(rows)} total):\n"]
        for row in rows:
            lines.append(f"  {row['code']} [{row['severity']}] - {row['description']}")
        return "\n".join(lines)
    finally:
        conn.close()


@mcp.tool()
def get_severity_summary() -> str:
    """Get a summary of DTC codes grouped by severity level.

    Returns:
        Count of codes per severity level (High, Medium, Low).
    """
    conn = _get_connection()
    try:
        rows = conn.execute(
            "SELECT severity, COUNT(*) as cnt FROM dtc_codes "
            "GROUP BY severity ORDER BY severity"
        ).fetchall()
        total = sum(row["cnt"] for row in rows)
        lines = [f"DTC Database Summary ({total} total codes):\n"]
        for row in rows:
            lines.append(f"  {row['severity']}: {row['cnt']} codes")
        return "\n".join(lines)
    finally:
        conn.close()


@mcp.tool()
def diagnose_multiple(codes: str) -> str:
    """Look up multiple DTC codes at once, separated by commas or spaces.

    Args:
        codes: Comma or space separated DTC codes (e.g. "P0300, P0171, P0420").

    Returns:
        Descriptions and suggested fixes for all provided codes.
    """
    import re
    code_list = [c.strip().upper() for c in re.split(r"[,\s]+", codes) if c.strip()]
    if not code_list:
        return "No codes provided."

    conn = _get_connection()
    try:
        results = []
        for code in code_list:
            row = conn.execute(
                "SELECT code, description, suggested_fix, category, severity "
                "FROM dtc_codes WHERE code = ? LIMIT 1",
                (code,),
            ).fetchone()
            if row:
                results.append(
                    f"--- {row['code']} [{row['category']}/{row['severity']}] ---\n"
                    f"Description: {row['description']}\n"
                    f"Suggested Fix: {row['suggested_fix']}"
                )
            else:
                results.append(f"--- {code} ---\nNot found in database.")

        return f"Diagnosis for {len(code_list)} code(s):\n\n" + "\n\n".join(results)
    finally:
        conn.close()


if __name__ == "__main__":
    mcp.run()
