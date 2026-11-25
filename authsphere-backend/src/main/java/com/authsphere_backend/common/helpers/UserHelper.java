package com.authsphere_backend.common.helpers;


import com.authsphere_backend.common.helpers.UserHelper;
import java.util.UUID;

public class UserHelper {

    public static UUID parseUUID(String uuid){
        return UUID.fromString(uuid);
    }
}
