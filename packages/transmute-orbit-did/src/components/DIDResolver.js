import React, { Component } from "react";

import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

import { withStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

// const orbitHelpers = require("../orbitHelpers");

const didData = require("../orbitdb.transmute.openpgp.did.json");

const { createOrbitDIDResolver } = require("../orbitHelpers");

// console.log(didData, orbitHelpers);
// const didExample = `/orbitdb/QmTjTQfsuSiMrMwzjLUZH4fgZAdmsML4aP1Ms6DTrhT4zb/did:transmute.openpgp:6075f9ad86de29d7644752c95e7379e3e5e4a806`;

const fullPlaceholder = `/orbitdb/QmQ8ZK.../did:openpgp:fingerprint:21b5ef5af6...`;

// console.log("did example: " + didExample);

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  card: {
    maxWidth: "auto",
    textAlign: "left"
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: "cover"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

class DIDResolver extends Component {
  state = {
    did: didData.orbitDID
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render() {
    const { classes, orbitdb } = this.props;
    const resolver = createOrbitDIDResolver(orbitdb);
    return (
      <div className="DIDResolver">
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              component="img"
              alt="Decentralized Identifier Resolver"
              className={classes.media}
              height="140"
              image="https://source.unsplash.com/category/nature/1280x1024"
              title="Decentralized Identifier Resolver"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Decentralized Identifier Resolver
              </Typography>
              <Typography component="p">
                Decentralized Identifiers (DIDs) are a new type of identifier
                for verifiable, "self-sovereign" digital identity. DIDs are
                fully under the control of the DID subject, independent from any
                centralized registry, identity provider, or certificate
                authority.
              </Typography>

              <TextField
                id="standard-with-placeholder"
                label="DID"
                placeholder={fullPlaceholder}
                className={classes.textField}
                value={this.state.did}
                onChange={this.handleChange("did")}
                margin="normal"
              />
              {this.state.doc && (
                <pre>{JSON.stringify(this.state.doc, null, 2)}</pre>
              )}
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              href="https://w3c-ccg.github.io/did-spec/"
            >
              Learn More
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                const doc = await resolver.resolve(this.state.did);
                this.setState({
                  doc
                });
              }}
            >
              Resolve
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(DIDResolver);