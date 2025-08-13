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
        if (rolesRepository.existsByName(name))
            throw new BadRequestException("Role * " + name + " * already exists");
        return rolesRepository.save(new Role(name));
    }

    public Role update(Long id, UpdateRoleDTO payload) {
        Role existingRole = rolesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Role id * " + id + " * not found"));

        String newName = payload.name().trim().toUpperCase();

        if (!newName.equals(existingRole.getName()) && rolesRepository.existsByName(newName)) {
            throw new BadRequestException("Role * " + newName + " * already exists");
        }

        existingRole.setName(newName);
        return rolesRepository.save(existingRole);
    }

    public void delete(Long id) {
        if (!rolesRepository.existsById(id)) {
            throw new NotFoundException("Role id * " + id + " * not found");
        }
        rolesRepository.deleteById(id);
    }

    public Role findById(Long id) {
        return this.rolesRepository.findById(id).orElseThrow(() -> new NotFoundException(id));
    }

    public List<Role> findAll() {
        return this.rolesRepository.findAll();
    }
}
