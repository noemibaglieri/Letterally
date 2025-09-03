package letterally.runners;

import letterally.entities.Role;
import letterally.entities.User;
import letterally.payloads.NewUserDTO;
import letterally.repositories.RolesRepository;
import letterally.repositories.UsersRepository;
import letterally.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;


@Component
public class AdminRunner implements CommandLineRunner {

    @Autowired
    private UsersService usersService;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Value("${ADMIN_PASSWORD}")
    private String adminPassword;

    @Value("${ADMIN_EMAIL}")
    private String adminEmail;

    @Value("${ADMIN_USERNAME}")
    private String adminUsername;

    @Override
    public void run(String... args) {

        Role adminRole = this.rolesRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    System.out.println("Cannot find * ADMIN * role. I'll create it!");
                    return this.rolesRepository.save(new Role("ADMIN"));
                });

        Role userRole = this.rolesRepository.findByName("USER")
                .orElseGet(() -> {
                    System.out.println("Cannot find * USER * role. I'll create it!");
                    return rolesRepository.save(new Role("USER"));
                });

        System.out.println("New role created: " + userRole.getId());

        if (usersService.existsByUsername(adminUsername)) {
            System.out.println(adminUsername + " is already an Admin");
            return;
        }

        if (usersService.existsByEmail(adminEmail)){
            System.out.println("This email is already in use. I will not create the admin.");
            return;
        }

        NewUserDTO createAdmin = new NewUserDTO(
                adminUsername,
                adminEmail,
                adminPassword,
                LocalDate.parse("1995-01-14")
        );

        User created = usersService.save(createAdmin);
        created.setRole(adminRole);

        usersRepository.save(created);
        System.out.println(adminUsername + " was created as an Admin!");
    }
}

