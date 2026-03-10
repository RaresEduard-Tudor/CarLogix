package com.carlogix.service;

import com.carlogix.dto.PasswordChangeRequest;
import com.carlogix.dto.ProfileUpdateRequest;
import com.carlogix.dto.UserResponse;
import com.carlogix.exception.ResourceNotFoundException;
import com.carlogix.model.User;
import com.carlogix.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setDisplayName("Test User");
        user.setPassword("encoded-old-password");
        user.setRole(User.Role.USER);
    }

    @Test
    void getProfile_success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = userService.getProfile(1L);

        assertEquals("test@example.com", response.getEmail());
        assertEquals("Test User", response.getDisplayName());
    }

    @Test
    void getProfile_notFound_throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getProfile(99L));
    }

    @Test
    void updateProfile_success() {
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setDisplayName("Updated Name");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserResponse response = userService.updateProfile(1L, request);

        assertEquals("Updated Name", response.getDisplayName());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void changePassword_success() {
        PasswordChangeRequest request = new PasswordChangeRequest();
        request.setCurrentPassword("old-password");
        request.setNewPassword("new-password-123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old-password", "encoded-old-password")).thenReturn(true);
        when(passwordEncoder.encode("new-password-123")).thenReturn("encoded-new-password");

        userService.changePassword(1L, request);

        verify(userRepository).save(argThat(u -> u.getPassword().equals("encoded-new-password")));
    }

    @Test
    void changePassword_wrongCurrentPassword_throws() {
        PasswordChangeRequest request = new PasswordChangeRequest();
        request.setCurrentPassword("wrong-password");
        request.setNewPassword("new-password-123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-old-password")).thenReturn(false);

        assertThrows(BadCredentialsException.class,
                () -> userService.changePassword(1L, request));
        verify(userRepository, never()).save(any());
    }
}
