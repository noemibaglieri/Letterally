package letterally.services;

import letterally.entities.Role;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewRoleDTO;
import letterally.payloads.UpdateRoleDTO;
import letterally.repositories.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    public Role save(NewRoleDTO payload) {
        String name = payload.name().trim().toUpperCase();
        if (this.rolesRepository.existsByName(name))
            throw new BadRequestException("Role * " + name + " * already exists");
        return this.rolesRepository.save(new Role(name));
    }

    public Role update(Long id, UpdateRoleDTO payload) {
        Role existingRole = this.rolesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Role id * " + id + " * not found"));

        String newName = payload.name().trim().toUpperCase();

        if (!newName.equals(existingRole.getName()) && this.rolesRepository.existsByName(newName)) {
            throw new BadRequestException("Role * " + newName + " * already exists");
        }

        existingRole.setName(newName);
        return this.rolesRepository.save(existingRole);
    }

    public void delete(Long id) {
        if (!this.rolesRepository.existsById(id)) {
            throw new NotFoundException("Role id * " + id + " * not found");
        }
        this.rolesRepository.deleteById(id);
    }

    public Role findById(Long id) {
        return this.rolesRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public List<Role> findAll() {
        return this.rolesRepository.findAll();
    }
}
