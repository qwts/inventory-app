export interface AlbumProps {
  id?: number;
  artistName: string;
  albumName: string;
  barcode: string;
  country: string;
  year: string;
  genre: string;
  variant: string;
  image: string;
}

export class Album implements AlbumProps {
  album: AlbumProps = {} as AlbumProps;

  constructor(album: AlbumProps | string) {
    if (typeof album === "string") {
      const fields = album.split("|").map((field) => field.trim());
      Object.assign(this.album, {
        artistName: fields[0] || "",
        albumName: fields[1] || "",
        barcode: fields[2] || "",
        year: fields[3] || "",
        country: fields[4] || "",
        genre: fields[5] || "",
        variant: fields[6] || "",
        image: fields[7] || "",
      });
      if (fields[8] != null) {
        this.album.id = Number(fields[8]);
      }
    } else if (typeof album === "object") {
      Object.assign(this.album, album);
    } else {
      throw new Error("Invalid album format");
    }
  }

  get id(): number | undefined {
    return this.album.id;
  }

  set id(value: number | undefined) {
    this.album.id = value;
  }

  get artistName(): string {
    return this.album.artistName;
  }

  set artistName(value: string) {
    this.album.artistName = value.trim();
  }

  get albumName(): string {
    return this.album.albumName;
  }

  set albumName(value: string) {
    this.album.albumName = value.trim();
  }

  get barcode(): string {
    return this.album.barcode;
  }

  set barcode(value: string) {
    this.album.barcode = value.trim();
  }

  get country(): string {
    return this.album.country;
  }

  set country(value: string) {
    this.album.country = value.trim();
  }

  get year(): string {
    return this.album.year;
  }

  set year(value: string) {
    this.album.year = value.trim();
  }

  get genre(): string {
    return this.album.genre;
  }

  set genre(value: string) {
    this.album.genre = value.trim();
  }

  get variant(): string {
    return this.album.variant;
  }

  set variant(value: string) {
    this.album.variant = value.trim();
  }

  get image(): string {
    return this.album.image;
  }

  set image(value: string) {
    this.album.image = value.trim();
  }

  toString(): string {
    return (
      `${(this.album.artistName || "").padEnd(80)}|` +
      `${(this.album.albumName || "").padEnd(80)}|` +
      `${(this.album.barcode || "").padEnd(42)}|` +
      `${(this.album.year || "").padEnd(20)}|` +
      `${(this.album.country || "").padEnd(20)}|` +
      `${(this.album.genre || "").padEnd(20)}|` +
      `${(this.album.variant || "").padEnd(20)}|` +
      `${(this.album.image || "").padEnd(20)}|` +
      `${this.album.id}`
    );
  }

  toJSON(): AlbumProps {
    return this.album;
  }

  static fromString(albumString: string): Album {
    return new Album(albumString);
  }

  static keys(): string[] {
    const k = [
      "Artist Name",
      "Album Name",
      "Barcode",
      "Country",
      "Year",
      "Genre",
      "Variant",
      "Image",
      "Id",
    ];
    return k;
  }
}
