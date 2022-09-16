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
      //console.error(newError);
      return [
        {
          err: errorCode,
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

    const decodedTxHashArray = transactionArray.map((hash) =>
      utils.serialize.base_decode(hash)
    );

    const provider = new JsonRpcProvider(getEnv(ENV).nearEnv.nodeUrl);

    const finalExecOutcomeArray = await Promise.all(
      decodedTxHashArray.map(async (decodedTxHash) => {
        return await provider.txStatus(decodedTxHash, accountId);
      })
    );

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
        response.type = "error";
        response.msg = errResult;
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

    if (response.type === "error") {
      switch (response.msg) {
        default:
          response.msg =
            "Wallet Error, Please Try Again. If You Have Enough Balance In Your Account And The Error Persists, Contact The System Administrator.";
          break;
      }
    } else if (
      response.method &&
      searchParamsResultArray[0].finalExecutionOutcome
    ) {
      response.type = "success";
      response.url = `${getEnv(ENV).nearEnv.explorerUrl}transactions/${
        searchParamsResultArray[0].finalExecutionOutcome.transaction.hash
      }`;
      switch (response.method) {
        default:
          response.msg = "Your Transaction Was Successful";
          break;
      }
    }
  }
  console.log(response);
  return response;
};
