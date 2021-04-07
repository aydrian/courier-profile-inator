import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  useToast
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";

export default function Twitter() {
  const toast = useToast();
  const [recipientId, setRecipientId] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const profile = {
    ...(email.length > 0 && { email }),
    ...(phoneNumber.length > 0 && { phone_number: phoneNumber })
  };

  const onRecipientIdChange = (e) => setRecipientId(e.target.value);
  const onAuthTokenChange = (e) => setAuthToken(e.target.value);
  const onEmailChange = (e) => setEmail(e.target.value);
  const onPhoneNumberChange = (e) => setPhoneNumber(e.target.value);

  const handleProfileSave = async (e) => {
    try {
      const { data } = await axios.post(`/api/courier/saveProfile`, {
        authToken,
        recipientId,
        profile
      });
      toast({
        title: "Profile saved.",
        description: "We've created the profile for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right"
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Unable to save Profile.",
        description: "We were uanble to create the profile for you.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  return (
    <Container>
      <Head>
        <title>Courier Profile-inator: Starter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Heading as="h1" marginBottom="4">
          Create your Profile
        </Heading>
        <FormControl isRequired>
          <FormLabel>Courier Auth Token</FormLabel>
          <Input
            type="password"
            onChange={onAuthTokenChange}
            value={authToken}
          />
          <FormHelperText>
            You can find this in the Courier App under{" "}
            <Link
              as="a"
              href="https://app.courier.com/settings/api-keys"
              isExternal
            >
              Settings &gt; API Keys
            </Link>
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Recipient Id</FormLabel>
          <Input onChange={onRecipientIdChange} value={recipientId} />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<EmailIcon color="gray.300" />}
            />
            <Input type="email" onChange={onEmailChange} value={email} />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<PhoneIcon color="gray.300" />}
            />
            <Input
              type="tel"
              onChange={onPhoneNumberChange}
              value={phoneNumber}
            />
          </InputGroup>
        </FormControl>
        <Box rounded="8px" my="8" bg="#011627">
          <Editor
            value={JSON.stringify(profile, null, 2)}
            highlight={(code) => highlight(code, Prism.languages.json, "json")}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12
            }}
          />
        </Box>
        <Button type="button" onClick={handleProfileSave} colorScheme="blue">
          Save Profile
        </Button>
      </main>
    </Container>
  );
}
