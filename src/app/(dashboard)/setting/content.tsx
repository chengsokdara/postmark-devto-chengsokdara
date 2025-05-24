export function SettingContent() {
  return (
    <>
      <section className="flex flex-col items-start">
        <fieldset className="fieldset w-full bg-base-300 p-6 xl:w-auto xl:pt-3">
          <legend className="fieldset-legend text-xl">API Settings</legend>

          <form className="flex flex-col xl:w-md gap-y-6">
            <label className="floating-label">
              <span>OpenAI Access Token</span>
              <input
                className="input input-lg w-full"
                name="openai-access-token"
                placeholder="OpenAI Access Token"
                type="password"
              />
              <pre className="mt-1 text-base-content/40">
                Use a disposable OpenAI access token.
              </pre>
            </label>

            <label className="floating-label">
              <span>Email Domain</span>
              <input
                className="input input-lg w-full"
                name="email-domain"
                placeholder="Email Domain"
                type="password"
              />
            </label>

            <button className="btn btn-accent" type="button">
              Save
            </button>
          </form>
        </fieldset>
      </section>
    </>
  );
}
