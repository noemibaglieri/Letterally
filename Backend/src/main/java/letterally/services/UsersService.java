package letterally.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import letterally.entities.Role;
import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewUserDTO;
import letterally.payloads.UpdateUserDTO;
import letterally.repositories.RolesRepository;
import letterally.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder bCrypt;

    @Autowired
    private Cloudinary imgUploader;

    public User save(NewUserDTO payload) {

        this.usersRepository.findByEmail(payload.email()).ifPresent(user -> {
            throw new BadRequestException("This email * " + user.getEmail() + " * is already in use.");
        });

        this.usersRepository.findByUsername(payload.username()).ifPresent(user -> {
            throw new BadRequestException("This username * " + user.getUsername() + " * is already in use.");
        });

        User newUser = new User(payload.username(), payload.email(), bCrypt.encode(payload.password()), payload.dateOfBirth());
        newUser.setAvatar("https://ui-avatars.com/api/?name=" + payload.username());

        Role defaultRole = this.rolesRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role * USER * not found in DB"));
        newUser.setRole(defaultRole);

        this.usersRepository.save(newUser);
        return newUser;
    }

    public User update(Long id, UpdateUserDTO payload) {
        User found = this.usersRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User with id * " + id + " * not found"));

        if (payload.username() != null && !payload.username().isBlank()) {
            this.usersRepository.findByUsername(payload.username()).ifPresent(user -> {
                if (!user.getId().equals(id)) {
                    throw new BadRequestException("Username already in use");
                }
            });
            found.setUsername(payload.username());
        }

        if (payload.email() != null && !payload.email().isBlank()) {
            this.usersRepository.findByEmail(payload.email()).ifPresent(user -> {
                if (!user.getId().equals(id)) {
                    throw new BadRequestException("Email already in use");
                }
            });
            found.setEmail(payload.email());
        }

        if (payload.avatar() != null && !payload.avatar().isBlank()) {
            found.setAvatar(payload.avatar());
        }

        if (payload.password() != null && !payload.password().isBlank()) {
            found.setPassword(bCrypt.encode(payload.password()));
        }

        return this.usersRepository.save(found);
    }

    public void delete(Long id) {
        User user = this.usersRepository.findById(id).orElseThrow(() -> new NotFoundException("User with id * " + id + " * not found"));
        this.usersRepository.delete(user);
    }


    public List<User> findAll() {
        return this.usersRepository.findAll();
    }

    public Map<String, String> uploadAvatar(long id, MultipartFile file) {
        User user = this.usersRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User ID not found * " + id + " *"));

        try {
            String avatar = (String) imgUploader.uploader()
                    .upload(file.getBytes(), ObjectUtils.emptyMap())
                    .get("url");

            user.setAvatar(avatar);
            this.usersRepository.save(user);

            return Map.of("avatar", avatar);

        } catch (IOException e) {
            throw new BadRequestException("A problem occurred. Your image was not uploaded.");
        }
    }

    public User findById(Long userId) {
        return this.usersRepository.findById(userId).orElseThrow(() -> new NotFoundException(userId));
    }

    public User findByEmail(String email){
        return this.usersRepository.findByEmail(email).orElseThrow(() -> new NotFoundException(email));
    }

}
