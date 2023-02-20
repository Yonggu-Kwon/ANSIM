package com.ansim.app.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Log4j2
@Controller
public class UserController {

    @RequestMapping(value = "/usr/dashboard", method = RequestMethod.GET)
    public String userDashboard(Model model, HttpServletRequest request, HttpSession session) {

        return "/usr/dashboard";
    }
}
