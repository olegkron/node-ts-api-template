import AWS from "aws-sdk";

export const awsEnvConfig = async () => {
  const ssmClient = new AWS.SSM({
    region: "eu-west-2",
  });

  ssmClient.getParameter(
    {
      Name: `NAMEOFPARAMETERSTORE`,
      WithDecryption: true,
    },
    async (err, data) => {
      if (data?.Parameter) {
        process.env = { ...process.env, ...JSON.parse(data.Parameter.Value) };
        const server = await import("./server");
        server.server();
      }
    }
  );
};
