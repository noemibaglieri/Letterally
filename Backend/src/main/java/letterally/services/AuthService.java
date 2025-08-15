package letterally.services;

import letterally.entities.User;
import letterally.exceptions.UnauthorisedException;
import letterally.payloads.LoginDTO;
import letterally.tools.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UsersService usersService;

    @Autowired
    private JWTTools jwtTools;

    @Autowired
    private PasswordEncoder bCrypt;

    public String checkCredentialsAndGenerateToken(LoginDTO payload) {
        User found = this.usersService.findByEmail(payload.email());

        if(bCrypt.matches(payload.password(), found.getPassword())) {
            return jwtTools.createToken(found);
        } else {
            throw new UnauthorisedException("Wrong credentials!");
        }
    }

}