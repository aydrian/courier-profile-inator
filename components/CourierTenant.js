import { useState } from "react";
import axios from "axios";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";

function TenantForm({ setTenant }) {
  const [authToken, setAuthToken] = useState("");

  const onAuthTokenChange = (e) => setAuthToken(e.target.value);

  const handleVerifySubmit = async (e) => {
    const { data } = await axios.post(`/api/courier/verify`, { authToken });
    const { data: lists } = await axios.post(`/api/courier/listLists`, {
      authToken
    });
    setTenant({ authToken, lists, ...data });
  };

  return (
    <FormControl>
      <FormLabel>Courier Auth Token</FormLabel>
      <Input type="password" onChange={onAuthTokenChange} value={authToken} />
      <Button type="button" onClick={handleVerifySubmit} colorScheme="blue">
        Submit
      </Button>
    </FormControl>
  );
}

function TenantView({ tenant }) {
  return <div>Tenant: {tenant.tenantName}</div>;
}

export default function CourierTenant({ tenant, setTenant }) {
  return (
    <>
      {tenant ? (
        <TenantView tenant={tenant} />
      ) : (
        <TenantForm setTenant={setTenant} />
      )}
    </>
  );
}
