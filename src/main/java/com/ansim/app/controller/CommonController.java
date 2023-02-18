package com.ansim.app.controller;

import com.ansim.app.factory.SystemConfigFactory;
import com.ansim.app.service.ConfigService;
import com.ansim.app.service.MemberService;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Log4j2
@Controller
public class CommonController {

    @Setter(onMethod_ = { @Autowired })
    private MemberService memberService;

    @Setter(onMethod_ = { @Autowired })
    private ConfigService configService;

    @RequestMapping(value = "/custom404")
    public String error404(Model model, HttpServletRequest request, HttpServletResponse response, HttpSession session) {

        return "custom404";
    }

    @RequestMapping(value = "/custom500")
    public String error500(Model model, HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        return "custom500";
    }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Model model, HttpServletRequest request, HttpSession session) {
        if(!memberService.isInstalled()) {
            return "redirect:/setup";
        }

        return "redirect:/usr/dashboard";
    }

    @RequestMapping(value = "/setup", method = RequestMethod.GET)
    public String setup(Model model, HttpServletRequest request, HttpSession session) {
        if(memberService.isInstalled()) {
            return "redirect:/";
        }

        SystemConfigFactory companyFactory = configService.loadSystemConfig("company");
        SystemConfigFactory serviceFactory = configService.loadSystemConfig("service");
        SystemConfigFactory mailFactory = configService.loadSystemConfig("mail");

        model.addAttribute("company", companyFactory.getAsHashMap());
        model.addAttribute("service", serviceFactory.getAsHashMap());
        model.addAttribute("mail", mailFactory.getAsHashMap());

        return "setup";
    }
}
