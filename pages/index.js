import Head from "next/head";
import axios from "axios";
import { useState } from "react";

import {
  Avatar,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  Select,
  Textarea
} from "@chakra-ui/react";

export default function Home() {
  const [botToken, setBotToken] = useState("");
  const [bot, setBot] = useState({});
  const [server, setServer] = useState("");
  const [channels, setChannels] = useState([]);
  const [channel, setChannel] = useState("");

  const onBotTokenChange = (e) => setBotToken(e.target.value);

  const handleServerChange = async (e) => {
    const guildId = e.target.value;
    console.log("Server ID: ", guildId);
    setServer(e.target.value);
    if (guildId) {
      const { data } = await axios.post(`/api/getDiscordServerChannels`, {
        botToken,
        guildId
      });

      setChannels(data);
    } else {
      setChannels([]);
    }
  };

  const handleChannelChange = async (e) => {
    setChannel(e.target.value);
  };

  const handleBotToken = async (e) => {
    const { data } = await axios.post(`/api/getDiscordBot`, { botToken });
    setBot(data);
  };

  return (
    <Container>
      <Head>
        <title>Courier Profile-inator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Heading as="h1">Courier Profile-inator</Heading>
        <p className="description">Generate Discord Profiles for Courier.</p>
        {!bot.username ? (
          <FormControl>
            <FormLabel>Discord Bot Token</FormLabel>
            <Input
              type="password"
              onChange={onBotTokenChange}
              value={botToken}
            />
            <Button type="button" onClick={handleBotToken} colorScheme="blue">
              Submit
            </Button>
          </FormControl>
        ) : (
          <div>
            <Avatar
              name={bot.username}
              src={`https://cdn.discordapp.com/avatars/${bot.id}/${bot.avatar}.png`}
            />{" "}
            {bot.username}
            <Select placeholder="Select Server" onChange={handleServerChange}>
              {bot.guilds.map((guild) => {
                return (
                  <option key={guild.id} value={guild.id}>
                    {guild.name}
                  </option>
                );
              })}
            </Select>
            {channels.length > 0 && (
              <Select
                placeholder="Select Channel"
                onChange={handleChannelChange}
              >
                {channels
                  .filter((channel) => {
                    return channel.type === 0;
                  })
                  .map((channel) => {
                    return (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    );
                  })}
              </Select>
            )}
            {channel && (
              <Textarea
                value={JSON.stringify({ discord: { channel } }, null, 2)}
              />
            )}
          </div>
        )}
      </main>
    </Container>
  );
}
