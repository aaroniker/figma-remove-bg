import React, { FormEvent, useEffect, ChangeEvent, useState } from "react";
import ReactDOM from "react-dom";
import "./ui.scss";

export const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    parent.postMessage(
      {
        pluginMessage: apiKey,
      },
      "*"
    );
  };

  useEffect(() => {
    window.onmessage = async (event) => {
      if (event.data.pluginMessage.type == "key") {
        setApiKey(event.data.pluginMessage.apikey || "");
      }
      if (event.data.pluginMessage.type == "run") {
        const base64 = btoa(
          new Uint8Array(event.data.pluginMessage.bytes).reduce(
            (data, byte) => {
              return data + String.fromCharCode(byte);
            },
            ""
          )
        );

        fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": event.data.pluginMessage.apikey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            image_file_b64: base64,
            size: "auto",
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response;
          })
          .then((response) => {
            response.json().then((res) => {
              parent.postMessage(
                {
                  pluginMessage: Uint8Array.from(
                    atob(res.data.result_b64),
                    (c) => c.charCodeAt(0)
                  ),
                },
                "*"
              );
            });
          })
          .catch((response) => {
            try {
              response.json().then((res) => {
                parent.postMessage(
                  {
                    pluginMessage: res,
                  },
                  "*"
                );
              });
            } catch (e) {
              parent.postMessage(
                {
                  pluginMessage: {
                    type: "error",
                    message: "Error, please DM me on 𝕏 @aaroniker_me",
                  },
                },
                "*"
              );
            }
          });
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} id="setApiKey">
      <ol>
        <li>
          Go to the{" "}
          <a
            target="_blank"
            href="https://www.remove.bg/r/mH3mbkczVmPg3G9os2bsbgUr"
          >
            remove.bg website
          </a>{" "}
          and create a free account (you will need to confirm your email).
        </li>
        <li>
          After that you can find your API key here{" "}
          <a target="_blank" href="https://www.remove.bg/profile#api-key">
            https://www.remove.bg/dashboard#api-key
          </a>
          .
        </li>
      </ol>
      <div className="row">
        <input
          type="text"
          placeholder="Api Key"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setApiKey(event.target.value)
          }
          value={apiKey}
        />
        <button type="submit">Save</button>
      </div>
      <p>
        More information about free accounts &amp; pricing{" "}
        <a target="_blank" href="https://www.remove.bg/pricing">
          here
        </a>
        .
      </p>
      <p>
        Follow me on{" "}
        <a target="_blank" href="https://twitter.com/aaroniker_me">
          𝕏 (@aaroniker_me)
        </a>{" "}
        for updates &amp; more.
      </p>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById("react-page"));
