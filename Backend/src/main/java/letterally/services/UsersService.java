package letterally.services;

import letterally.entities.User;
import letterally.exceptions.BadRequestException;
import letterally.exceptions.NotFoundException;
import letterally.payloads.NewUserDTO;
import letterally.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder bCrypt;

    public User save(NewUserDTO payload) {

        this.usersRepository.findByEmail(payload.email()).ifPresent(user -> {
            throw new BadRequestException("This email * " + user.getEmail() + " * is already in use.");
        });

        this.usersRepository.findByUsername(payload.username()).ifPresent(user -> {
            throw new BadRequestException("This username * " + user.getUsername() + " * is already in use.");
        });

        User newUser = new User(payload.username(), payload.email(), bCrypt.encode(payload.password()), payload.dateOfBirth());
        newUser.setAvatar("https://ui-avatars.com/api/?name=" + payload.username());
        this.usersRepository.save(newUser);
        return newUser;
    }

    public User findById(Long userId) {
        return this.usersRepository.findById(userId).orElseThrow(() -> new NotFoundException(userId));
    }

    public User findByEmail(String email){
        return this.usersRepository.findByEmail(email).orElseThrow(() -> new NotFoundException(email));
    }

}
