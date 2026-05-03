package com.mwaisaka.AfyaSignal.mapper;

import com.mwaisaka.AfyaSignal.dto.AuthResponse;
import com.mwaisaka.AfyaSignal.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface UserMapper {

    @Mapping(target = "token", ignore = true)
    AuthResponse toAuthResponse(User user);
}