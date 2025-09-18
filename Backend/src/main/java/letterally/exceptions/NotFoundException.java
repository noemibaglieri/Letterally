package letterally.exceptions;

public class NotFoundException extends RuntimeException {
    public NotFoundException(long id) {
        super("The id * " + id + " * was not found. Try again");
    }

    public NotFoundException(String msg) {
        super(msg);
    }
}
