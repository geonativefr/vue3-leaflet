export const MUTE_ERRORS = () => ({});
export const LOG_ERRORS = (e) => console.debug(e);

export async function silently(callback, onFailure = LOG_ERRORS) {
    try {
      await callback();
    } catch (e) {
      onFailure(e);
    }
}
