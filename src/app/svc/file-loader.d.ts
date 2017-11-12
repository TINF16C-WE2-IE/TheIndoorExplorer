// This is magic.
// See https://stackoverflow.com/a/43834750/4464570 or https://stackoverflow.com/a/42988688/4464570

declare module 'file-loader?name=[name].js!*' {
    const value: string;
    export = value;
}
