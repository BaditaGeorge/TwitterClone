export default function processAxiosPromise(axiosPromise) {
  return axiosPromise
    .then((resp) => [resp.status, resp.data])
    .catch((err) => {
      const { response } = err;
      return [response.request.status, response.data];
    });
}
