import styled from "styled-components";
import { utils } from "ethers";
import { Typography, Box, Tooltip } from "@material-ui/core";

import AddressUtils from "./AddressUtils";

import EmpState from "../../containers/EmpState";
import Token from "../../containers/Token";
import EmpContract from "../../containers/EmpContract";
import EmpSponsors from "../../containers/EmpSponsors";
import Totals from "../../containers/Totals";
import PriceFeed from "../../containers/PriceFeed";
import Etherscan from "../../containers/Etherscan";
import { number } from "prop-types";

const Label = styled.span`
  color: #999999;
`;

const Link = styled.a`
  color: white;
  font-size: 14px;
`;

const Status = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const fromWei = utils.formatUnits;
const parseBytes32String = utils.parseBytes32String;

const GeneralInfo = () => {
  const { contract } = EmpContract.useContainer();
  const { empState } = EmpState.useContainer();
  const { activeSponsors } = EmpSponsors.useContainer();
  const { gcr } = Totals.useContainer();
  const { latestPrice, sourceUrls } = PriceFeed.useContainer();
  const { getEtherscanUrl } = Etherscan.useContainer();
  const {
    expirationTimestamp: expiry,
    priceIdentifier: priceId,
    collateralRequirement: collReq,
    minSponsorTokens,
    isExpired,
  } = empState;
  const { symbol: tokenSymbol, decimals: tokenDec } = Token.useContainer();

  const defaultMissingDataDisplay = "N/A";

  if (
    activeSponsors !== null &&
    expiry !== null &&
    gcr !== null &&
    priceId !== null &&
    collReq !== null &&
    minSponsorTokens !== null &&
    tokenSymbol !== null &&
    tokenDec !== null &&
    isExpired !== null
  ) {
    const expiryTimestamp = expiry.toString();
    const expiryDate = new Date(
      expiry.toNumber() * 1000
    ).toLocaleString("en-GB", { timeZone: "UTC" });
    let prettyLatestPrice = defaultMissingDataDisplay;
    let pricedGcr: string = defaultMissingDataDisplay;
    if (latestPrice != null) {
      prettyLatestPrice = Number(latestPrice).toFixed(8);
      pricedGcr = (gcr / latestPrice).toFixed(8);
    }
    let srcUrls: string[] = [];
    if (sourceUrls != undefined) {
      srcUrls = sourceUrls;
    }

    const priceIdUtf8 = parseBytes32String(priceId);
    const collReqPct = parseFloat(fromWei(collReq)).toString();
    const minSponsorTokensSymbol = `${parseFloat(
      fromWei(minSponsorTokens, tokenDec)
    )} ${tokenSymbol}`;

    const sponsorCount = Object.keys(activeSponsors).length.toString();
    return renderComponent(
      expiryTimestamp,
      expiryDate,
      prettyLatestPrice,
      pricedGcr,
      priceIdUtf8,
      collReqPct,
      minSponsorTokensSymbol,
      isExpired ? "YES" : "NO",
      srcUrls,
      sponsorCount
    );
  } else {
    return renderComponent();
  }

  function renderComponent(
    expiryTimestamp: string = defaultMissingDataDisplay,
    expiryDate: string = defaultMissingDataDisplay,
    prettyLatestPrice: string = defaultMissingDataDisplay,
    pricedGcr: string = defaultMissingDataDisplay,
    priceIdUtf8: string = defaultMissingDataDisplay,
    collReqPct: string = defaultMissingDataDisplay,
    minSponsorTokensSymbol: string = defaultMissingDataDisplay,
    isExpired: string = defaultMissingDataDisplay,
    sourceUrls: string[] = [],
    sponsorCount: string = defaultMissingDataDisplay
  ) {
    return (
      <Box>
        <Typography variant="h5">{`General Info `}</Typography>
        <AddressUtils />

        <Status>
          <Label>Expiry date: </Label>
          <Tooltip title={`Timestamp: ${expiryTimestamp}`} interactive>
            <span>{expiryDate} UTC</span>
          </Tooltip>
        </Status>

        <Status>
          <Label>Is expired{`: `}</Label>
          {isExpired}
        </Status>

        <Status>
          <Label>Price identifier: </Label>
          {priceIdUtf8}
        </Status>

        <Status>
          <Label>Identifier price: </Label>
          <Tooltip title={"Data Source: TraderMade"}>
            <span>{`${prettyLatestPrice}`} </span>
          </Tooltip>
        </Status>

        <Status>
          <Label>Global collateral ratio: </Label>
          <Tooltip
            title={`The Global Collateralization Ratio (GCR) is the ratio of the total amount of collateral to total number of outstanding tokens.`}
          >
            <span>{pricedGcr}</span>
          </Tooltip>
        </Status>
        <Status>
          <Label>Collateral requirement: </Label>
          {collReqPct}
        </Status>
        <Status>
          <Label>Unique sponsors: </Label>
          {sponsorCount}
        </Status>
        <Status>
          <Label>Minimum sponsor tokens: </Label>
          {minSponsorTokensSymbol}
        </Status>
      </Box>
    );
  }
};

export default GeneralInfo;
