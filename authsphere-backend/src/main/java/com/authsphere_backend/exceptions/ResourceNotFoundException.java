package com.authsphere_backend.exceptions;

public class ResourceNotFoundException extends RuntimeException {

    // Constructor with a custom error message
    public ResourceNotFoundException(String message) {
        super(message);
    }

    // Default constructor
    public ResourceNotFoundException() {
        super("Resource not found !!");
    }
}