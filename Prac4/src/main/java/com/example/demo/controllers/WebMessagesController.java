package com.example.demo.controllers;

import com.example.demo.models.OutputMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
public class WebMessagesController {

    @GetMapping("/webs")
    public String getWebs() {
        return "/webs";
    }

    @MessageMapping("/webs")
    @SendTo("/topic/messages")
    public OutputMessage send(OutputMessage outputMessage) throws Exception {
        String time = new SimpleDateFormat("HH:mm").format(new Date());
        return new OutputMessage(outputMessage.getText() + " (Server response)", time);
    }

}
