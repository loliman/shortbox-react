import React from "react";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

type CoverInput = File | { __typename?: string; url?: string } | string | null | undefined;

interface CoverProps {
  isDesktop?: boolean;
  cover?: CoverInput;
  onDelete?: () => void;
}

interface CoverState {
  isCoverOpen: boolean;
}

class Cover extends React.Component<CoverProps, CoverState> {
  private objectUrl?: string;
  private objectUrlSource?: Blob;

  constructor(props: CoverProps) {
    super(props);
    this.state = { isCoverOpen: false };
  }

  componentDidUpdate(prevProps: CoverProps) {
    if (prevProps.cover !== this.props.cover) this.releaseObjectUrl();
  }

  componentWillUnmount() {
    this.releaseObjectUrl();
  }

  shouldComponentUpdate(nextProps: CoverProps, nextState: CoverState) {
    return this.props.cover !== nextProps.cover || this.state.isCoverOpen !== nextState.isCoverOpen;
  }

  render() {
    const previewSrc = this.createPreview(this.props.cover);

    return (
      <div className={this.props.isDesktop ? "right field50" : "mobileCover"}>
        <CardMedia
          image={previewSrc}
          title="Cover Vorschau"
          className="media field100"
          onClick={() => this.toggleCoverIsOpen()}
        />

        <Dialog open={this.state.isCoverOpen} onClose={() => this.toggleCoverIsOpen()} maxWidth="md">
          <img src={previewSrc} alt="Cover Vorschau" />
        </Dialog>

        {this.props.onDelete ? (
          <IconButton className="removeBtnCover" aria-label="Entfernen" onClick={this.props.onDelete}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </div>
    );
  }

  private toggleCoverIsOpen() {
    this.setState((prev) => ({ isCoverOpen: !prev.isCoverOpen }));
  }

  private createPreview(file: CoverInput) {
    if (!file || file === "") return "/nocover.jpg";

    if (
      typeof file === "object" &&
      "__typename" in file &&
      file.__typename === "Cover" &&
      typeof file.url === "string"
    ) {
      return file.url;
    }

    if (typeof file === "string") return file;

    if (typeof Blob !== "undefined" && file instanceof Blob) {
      if (this.objectUrlSource !== file) {
        this.releaseObjectUrl();
        this.objectUrlSource = file;
        this.objectUrl = URL.createObjectURL(file);
      }

      return this.objectUrl || "/nocover.jpg";
    }

    return "/nocover.jpg";
  }

  private releaseObjectUrl() {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = undefined;
    this.objectUrlSource = undefined;
  }
}

export default Cover;
