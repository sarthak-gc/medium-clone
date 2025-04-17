import { Hono } from "hono";
import router from "./routes";
import { cors } from "hono/cors";

const app = new Hono();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.route("/api/v1", router);

export default app;

// const request = async (configuration: any) => {
//   const { authorization, config, ...restConfiguration } = configuration;
//   const defaultHeader: any = {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "Api-Key": process.env.API_KEY,
//   };
//   if (!!authorization) {
//     const user = helper.getUser();
//     if (!user?.token) {
//       toast.error("No token found");
//       throw new Error("No token found");
//     }
//     defaultHeader.Authorization = `Bearer ${user?.token}`;
//   }

//   await loadingProcess(configuration, true);
//   return await axios({
//     ...restConfiguration,
//     url: `${APP_BASE_URL}/${restConfiguration?.url.toString()}`,
//     headers: defaultHeader,
//   })
//     .then(async (resp) => {
//       if (!!resp?.data?.errors) {
//         throw new Error(resp?.data?.errors[0]?.message);
//       }
//       const data = resp?.data?.data;
//       if (!!config.store) {
//         await storeProcess(config.store, data);
//       }
//       if (!!config.successMsg) {
//         toast.success(configuration?.config?.successMsg);
//       }
//       return data;
//     })
//     .catch(async (err) => {
//       const message =
//         err.response.data.message ||
//         err.response.data.errors[0]?.message ||
//         err?.message;
//       if (!!config?.showErr) {
//         toast.error(message);
//       }
//       if (err?.response?.status === 401 || message == "Unauthorized") {
//         helper.removeUser();
//         setTimeout(() => {
//           window.location.reload();
//         }, 700);
//       } else {
//         await loadingProcess(config, false);
//       }

//       throw new Error(err);
//     });
// };
