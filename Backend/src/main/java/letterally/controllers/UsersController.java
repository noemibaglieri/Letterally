package letterally.controllers;

import letterally.entities.User;
import letterally.exceptions.ValidationException;
import letterally.payloads.UpdateUserDTO;
import letterally.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return this.usersService.findAll();
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User getUserById(@PathVariable Long userId) {
        return this.usersService.findById(userId);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public User update(@RequestBody @Validated UpdateUserDTO payload, BindingResult validationResult, @PathVariable Long userId) {
        if(validationResult.hasErrors()) {
            throw new ValidationException((validationResult.getFieldErrors()
                    .stream().map(fieldError -> fieldError.getDefaultMessage()).toList()));
        } else {
            return this.usersService.update(userId, payload);
        }
    }

    @PatchMapping("/{userId}/avatar")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Map<String, String> uploadAvatar(@PathVariable Long userId, @RequestParam("avatar") MultipartFile file) {
        return this.usersService.uploadAvatar(userId, file);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long userId) {
        this.usersService.delete(userId);
    }

    @GetMapping("/me")
    public User getOwnProfile(@AuthenticationPrincipal User currentAuthenticatedUser) {
        return currentAuthenticatedUser;
    }

    @PutMapping("/me")
    public User updateOwnProfile(@AuthenticationPrincipal User currentAuthenticatedUser, @RequestBody @Validated UpdateUserDTO payload) {
        return this.usersService.update(currentAuthenticatedUser.getId(), payload);
    }

    @PatchMapping("/me/avatar")
    public Map<String, String> updateOwnAvatar(@AuthenticationPrincipal User currentUser, @RequestParam("avatar") MultipartFile file) {
        return this.usersService.uploadAvatar(currentUser.getId(), file);
    }

    @DeleteMapping("/me")
    public void deleteOwnProfile(@AuthenticationPrincipal User currentAuthenticatedUser) {
        this.usersService.delete(currentAuthenticatedUser.getId());
    }
}
