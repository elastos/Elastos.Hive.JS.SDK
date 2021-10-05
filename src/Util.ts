export interface IPostOptions {
  url: string;
  userToken?: string;
  body?: any;
}

export class Util {
  static async SendGet(options: IPostOptions): Promise<any> {
    let payload: any = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (options.userToken) {
      payload.headers["Authorization"] = "token " + options.userToken;
    }

    let response = await fetch(options.url, payload);

    if (response.ok) {
      let json = await response.json();

      if (json._status != "OK") {
        throw new Error(
          `Error on send GET to ${options.url} - ${json._error.code} - ${json._error.message}`
        );
      }

      return json;
    }

    throw new Error(
      `Error on send GET to ${options.url} - ${response.status} - ${response.statusText}`
    );
  }

  static async SendPost(options: IPostOptions): Promise<any> {
    let payload: any = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (options.userToken) {
      payload.headers["Authorization"] = "token " + options.userToken;
    }

    if (options.body) {
      payload.headers["Content-Length"] = JSON.stringify(options.body).length;
      payload.body = JSON.stringify(options.body);
    }

    let response = await fetch(options.url, payload);

    if (response.ok) {
      let json = await response.json();

      if (json._status != "OK") {
        throw new Error(
          `Error on send POST to ${options.url} - ${json._error.code} - ${json._error.message}`
        );
      }

      return json;
    }

    throw new Error(
      `Error on send POST to ${options.url} - ${response.status} - ${response.statusText}`
    );
  }

  static async SendPut(options: IPostOptions): Promise<any> {
    let payload: any = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (options.userToken) {
      payload.headers["Authorization"] = "token " + options.userToken;
    }

    let response = await fetch(options.url, payload);

    if (response.ok) {
      let json = await response.json();

      if (json._status != "OK") {
        throw new Error(
          `Error on send PUT to ${options.url} - ${json._error.code} - ${json._error.message}`
        );
      }

      return json;
    }

    throw new Error(
      `Error on send PUT to ${options.url} - ${response.status} - ${response.statusText}`
    );
  }

  static async SendPatch(options: IPostOptions): Promise<any> {
    let payload: any = {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (options.userToken) {
      payload.headers["Authorization"] = "token " + options.userToken;
    }

    let response = await fetch(options.url, payload);

    if (response.ok) {
      let json = await response.json();

      if (json._status != "OK") {
        throw new Error(
          `Error on send PATCH to ${options.url} - ${json._error.code} - ${json._error.message}`
        );
      }

      return json;
    }

    throw new Error(
      `Error on send PATCH to ${options.url} - ${response.status} - ${response.statusText}`
    );
  }

  static async SendDelete(options: IPostOptions): Promise<any> {
    let payload: any = {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    if (options.userToken) {
      payload.headers["Authorization"] = "token " + options.userToken;
    }

    let response = await fetch(options.url, payload);

    if (response.ok) {
      let json = await response.json();

      if (json._status != "OK") {
        throw new Error(
          `Error on send DELETE to ${options.url} - ${json._error.code} - ${json._error.message}`
        );
      }

      return json;
    }

    throw new Error(
      `Error on send DELETE to ${options.url} - ${response.status} - ${response.statusText}`
    );
  }
}
