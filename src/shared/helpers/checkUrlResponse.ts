import { utils } from "near-api-js";
import {
  FinalExecutionOutcome,
  getTransactionLastResult,
  JsonRpcProvider,
} from "near-api-js/lib/providers";
import { parseRpcError } from "near-api-js/lib/utils/rpc_errors";
import { ENV, getEnv } from "../../near/config";

function removeQueryString(savedParams = "") {
  var uri = window.location.toString();
  if (uri.indexOf("?") > 0) {
    var clean_uri = uri.substring(0, uri.indexOf("?")) + savedParams;
    window.history.replaceState({}, document.title, clean_uri);
  }
}

function hasSuccessValue(obj: {}): obj is { SuccessValue: string } {
  return "SuccessValue" in obj;
}

async function checkRedirectSearchParamsMultiple(accountId: string): Promise<
  {
    err?: string;
    data?: any;
    method?: string;
    finalExecutionOutcome?: FinalExecutionOutcome;
  }[]
> {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const referral = urlParams.get("r");
    if (referral) {
      removeQueryString(`?r=${referral}`);
    } else {
      removeQueryString();
    }
    const txHash: string | null = urlParams.get("transactionHashes");
    const errorCode = urlParams.get("errorCode");
    //error message in the url is incomplete
    /*const errorMessage = decodeURIComponent(
      urlParams.get("errorMessage") || ""
    );*/

    if (errorCode) {
      const newError = "Wallet error"; // + " " + errorMessage;
      console.log(newError);
      //console.error(newError);
      return [
        {
          err: newError,
        },
      ];
    }

    if (!txHash) return [];

    let transactionArray: string[];

    if (txHash.includes(",")) {
      transactionArray = txHash.split(",");
    } else {
      transactionArray = [txHash];
    }
    console.log(transactionArray);

    const decodedTxHashArray = transactionArray.map((hash) =>
      utils.serialize.base_decode(hash)
    );

    const provider = new JsonRpcProvider(getEnv(ENV).nearEnv.nodeUrl);

    const finalExecOutcomeArray = await Promise.all(
      decodedTxHashArray.map(async (decodedTxHash) => {
        return await provider.txStatus(decodedTxHash, accountId);
      })
    );
    console.log(finalExecOutcomeArray);
    console.log(hasSuccessValue(finalExecOutcomeArray[0].status));
    console.log(getTransactionLastResult(finalExecOutcomeArray[0]));

    let output = [];
    for (let i = 0; i < finalExecOutcomeArray.length; i++) {
      let method: string | undefined = undefined;
      const finalExecOutcome = finalExecOutcomeArray[i];
      if (finalExecOutcome.transaction?.actions?.length) {
        const actions = finalExecOutcome.transaction.actions;
        //recover methodName of first FunctionCall action
        for (let n = 0; n < actions.length; n++) {
          let item = actions[n];
          if ("FunctionCall" in item) {
            //@ts-ignore
            method = item.FunctionCall.method_name;
            break;
          }
        }
      }

      //@ts-ignore
      let failure: any = finalExecOutcome.status.Failure;
      if (failure) {
        console.log("finalExecOutcome.status.Failure", failure);
        //console.error("finalExecOutcome.status.Failure", failure);
        const errorMessage =
          typeof failure === "object"
            ? parseRpcError(failure).toString()
            : `Transaction <a href="${
                getEnv(ENV).nearEnv.explorerUrl
              }/transactions/${finalExecOutcome.transaction.hash}">${
                finalExecOutcome.transaction.hash
              }</a> failed`;
        output.push({
          err: errorMessage,
          method: method,
        });
      } else {
        output.push({
          data: getTransactionLastResult(finalExecOutcome),
          method: method,
          finalExecutionOutcome: finalExecOutcome,
        });
      }
    }

    return output;
  } catch (e) {
    console.log(e);
    //console.error(e);
    return [{ err: "error" }];
  }
}

export const checkUrlResponse = async (accountId: string) => {
  const response = {
    type: "",
    method: "",
    msg: "",
    url: "",
    data: undefined,
  };

  if (accountId) {
    const searchParamsResultArray = await checkRedirectSearchParamsMultiple(
      accountId
    );

    let method = "";
    let err;
    let args: any[] = [];

    searchParamsResultArray.forEach((searchParamsResult) => {
      const {
        err: errResult,
        data,
        method: methodResult,
        finalExecutionOutcome,
      } = searchParamsResult;

      if (methodResult) {
        response.method = methodResult;
      }

      if (errResult) {
        err = errResult;
        return;
      }

      if (data) {
        response.data = data;
      }

      if (finalExecutionOutcome) {
        let arg = JSON.parse(
          window.atob(
            finalExecutionOutcome.transaction.actions[0].FunctionCall.args
          )
        );
        args.push(arg);
        console.log(arg);
      }
    });

    if (err) {
      response.type = "error";
      switch (err) {
        default:
          response.msg = "Wallet Error, Please Try Again.";
          break;
      }
    } else if (method) {
      switch (method) {
        case "offer":
          console.log("your offer was successful");
          break;

        default:
          console.log("Method", method);
          console.log("Args", args.join("\n"));
          break;
      }
    }
  }
  return response;
};
