import AWS from "aws-sdk";

export const awsEnvConfig = async () => {
  const ssmClient = new AWS.SSM({
    region: process.env.AWS_REGION,
  });

  ssmClient.getParameter(
    {
      Name: process.env.SSM_PARAMETER_NAME,
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
