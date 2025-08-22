package letterally.controllers;

import letterally.entities.Role;
import letterally.exceptions.ValidationException;
import letterally.payloads.NewRoleDTO;
import letterally.payloads.UpdateRoleDTO;
import letterally.services.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RolesController {

    @Autowired
    private RolesService rolesService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Role> getAllRoles() {
        return this.rolesService.findAll();
    }

    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Role getRoleById(@PathVariable Long roleId) {
        return this.rolesService.findById(roleId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('ADMIN')")
    public Role save(@RequestBody @Validated NewRoleDTO payload) {
        return this.rolesService.save(payload);
    }

    @PutMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Role update(@RequestBody @Validated UpdateRoleDTO payload, BindingResult validationResult, @PathVariable Long roleId) {
        if(validationResult.hasErrors()) {
            throw new ValidationException((validationResult.getFieldErrors()
                    .stream().map(fieldError -> fieldError.getDefaultMessage()).toList()));
        } else {
            return this.rolesService.update(roleId, payload);
        }
    }

    @DeleteMapping("/{roleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('ADMIN')")
    public void delete(@PathVariable Long roleId) {
        this.rolesService.delete(roleId);
    }
}
