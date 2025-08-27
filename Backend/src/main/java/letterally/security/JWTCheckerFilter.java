package letterally.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import letterally.entities.User;
import letterally.exceptions.NotFoundException;
import letterally.exceptions.UnauthorisedException;
import letterally.services.UsersService;
import letterally.tools.JWTTools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTCheckerFilter extends OncePerRequestFilter {

    @Autowired private UsersService usersService;
    @Autowired private JWTTools jwtTools;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String accessToken = authHeader.substring("Bearer ".length());

        try {
            jwtTools.verifyToken(accessToken);

            String idStr = jwtTools.extractIdFromToken(accessToken);
            Long userId = Long.parseLong(idStr);

            User currentUser = usersService.findById(userId);

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    currentUser, null, currentUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);

        } catch (UnauthorisedException | NotFoundException | NumberFormatException ex) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Invalid token or user not found\"}");
        } catch (Exception ex) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Authentication error\"}");
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request){
        String uri = request.getRequestURI();
        AntPathMatcher m = new AntPathMatcher();
        return m.match("/v3/api-docs", uri)
                || m.match("/v3/api-docs/**", uri)
                || m.match("/swagger-ui.html", uri)
                || m.match("/swagger-ui/**", uri)
                || m.match("/auth/**", uri)
                || m.match("/error", uri);
    }
}
