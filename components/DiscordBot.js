import { useState } from "react";
import axios from "axios";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar
} from "@chakra-ui/react";

function BotForm({ setBot }) {
  const [botToken, setBotToken] = useState("");

  const onBotTokenChange = (e) => setBotToken(e.target.value);

  const handleBotToken = async (e) => {
    const { data } = await axios.post(`/api/discord/getBot`, { botToken });
    setBot({ botToken, ...data });
  };

  return (
    <FormControl>
      <FormLabel>Discord Bot Token</FormLabel>
      <Input type="password" onChange={onBotTokenChange} value={botToken} />
      <Button type="button" onClick={handleBotToken} color="#7289DA">
        Submit
      </Button>
    </FormControl>
  );
}

function BotView({ bot, setBot }) {
  const handleBotReset = async (e) => {
    setBot(null);
  };

  return (
    <Box bg="#7289DA" rounded="8px" p={4} color="white">
      <Avatar
        name={bot.username}
        src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png`}
      />{" "}
      {bot.username}
      <Button type="button" onClick={handleBotReset} color="#2C2F33" size="xs">
        Reset
      </Button>
    </Box>
  );
}

export default function DiscordBot({ bot, setBot }) {
  return (
    <>
      {bot ? (
        <BotView bot={bot} setBot={setBot} />
      ) : (
        <BotForm setBot={setBot} />
      )}
    </>
  );
}
