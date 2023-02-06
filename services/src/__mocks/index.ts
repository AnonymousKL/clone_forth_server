import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const axiosInstance = axios.create()

// const mockAdapterInstance = new AxiosMockAdapter(axiosInstance, {
//   delayResponse: 1000,
//   // onNoMatch: 'passthrough',
// })

// const config = require('./mock-data.json')
// config.reduce((adapter: AxiosMockAdapter, { path, data }: { path: string, data: any }) => {
//   return path ? adapter.onAny(path).reply(200, data) : adapter
// }, mockAdapterInstance)

export default axiosInstance
