package com.ansim.app.controller;

import com.ansim.app.domain.AgentVO;
import com.ansim.app.domain.MemberVO;
import com.ansim.app.factory.SystemConfigFactory;
import com.ansim.app.service.AgentService;
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

    @Setter(onMethod_ = { @Autowired })
    AgentService agentService;

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

        MemberVO member = (MemberVO) session.getAttribute("member");
        if(member != null) {
            return "redirect:/usr/dashboard";
        }

        return "redirect:/login";
    }

    @RequestMapping(value = "/setup", method = RequestMethod.GET)
    public String setup(Model model, HttpServletRequest request, HttpSession session) {
        if(memberService.isInstalled()) {
            return "redirect:/";
        }

        SystemConfigFactory companyFactory = configService.loadSystemConfig("company");
        SystemConfigFactory serviceFactory = configService.loadSystemConfig("service");
        SystemConfigFactory mailFactory = configService.loadSystemConfig("mail");

        MemberVO admin = memberService.readSetupMember();
        AgentVO agent = null;
        if(admin != null) {
            agent = agentService.readSetupAgent(admin.getUserId());
        }
        model.addAttribute("company", companyFactory.getAsHashMap());
        model.addAttribute("service", serviceFactory.getAsHashMap());
        model.addAttribute("mail", mailFactory.getAsHashMap());
        model.addAttribute("admin", admin);
        model.addAttribute("agent", agent);

        return "setup";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login(Model model, HttpServletRequest request, HttpSession session) {
        if(!memberService.isInstalled()) {
            return "redirect:/setup";
        }

        SystemConfigFactory serviceFactory = configService.loadSystemConfig("service");

        model.addAttribute("service", serviceFactory.getAsHashMap());

        return "login";
    }
}
