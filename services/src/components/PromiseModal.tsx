import * as ReactDOM from "react-dom";

// TODO CORE_JS HERE
export const showModal = async (Options: any = {}) => {
  const _id = "___modal";
  let container = document.createElement("div");
  container.id = _id;
  document.body.appendChild(container);
  return new Promise((resolve) => {
    const doResolve = (res: any) => {
      document.getElementById(_id)?.remove();
      resolve(res);
    };
    const PortalContent = (
      <Options.Template {...Options.props} resolve={doResolve} />
    );
    ReactDOM.render(
      ReactDOM.createPortal(PortalContent, container),
      document.createElement("div")
    );
  });
};

export const _confirm = {
  delete: async (options: any = {}) => {
    return await showModal(options);
  },
};

export default function Test() {
  const doDelete = async () => {
    // @ts-ignore
    let res = await _confirm.delete({ Template: ModalDeleteCookie });
    console.error(res);
  };
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>

      <button onClick={doDelete}>Delete Cóc</button>
    </div>
  );
}
