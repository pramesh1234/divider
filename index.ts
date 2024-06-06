const fs = require('fs');
const pg = require('pg');
const url = require('url');

const config = {
    user: "avnadmin",
    password: "AVNS_fAsTFRcIALhz1AGm6j3",
    host: "pg-2b0e095f-prameshsingh2411-21cc.f.aivencloud.com",
    port: 15950,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUVY6vxFKBE34CPsScpj8PXfK3KF4wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvNjUwOTJkMGItZmJmZS00NDVjLWFlNTUtOThhMjBkZWY2
ZWY0IFByb2plY3QgQ0EwHhcNMjQwNjAzMDg0MTU5WhcNMzQwNjAxMDg0MTU5WjA6
MTgwNgYDVQQDDC82NTA5MmQwYi1mYmZlLTQ0NWMtYWU1NS05OGEyMGRlZjZlZjQg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAMu91UL3
eSsjw3m5v6PFl6G5KhyjW3IxxdPo3hF4+FZbf2F/Uk0LraRs7xR772PkrYQhZYEg
+uztY8vywr9KwfxspwxzzljdoZpYjq3+/gLuaWYgMCmJj/arDJu4z2C0YLu7uG/o
HN84u5AOcU8QS5pBnYr0LXYcKElhlBGhVze0uTRB78q7NBj1zUIBvIdgNi+ObSET
MKHPd3ILdkIRY22HPJz1EpnXPWKs7fs9HjN4lDCokqF+s76B4E9V+9ofXomAjmiQ
TqpVyqyrM+6J03OqTSb8mkJQERe+P7EDKo8aNCPbjuULPj1qA6Zifmn5fnA6lZih
uHamqahhGMCuODKOfZ7CIEGeOWdZGgfyD5TBj2kNATZznpA39YkiHkABPG93+CT+
4J/1FFTNzhHeDyCH7ulwt+s1Wt8VGA8+0MrjQiZpSp/5yfr6L8XEffSl3O5AP9Ca
TSiQOwQI/Ci85e4kJ47ewZVnateR1L3jKs7QLZ7akC3NZ73wOt3EZ27UAQIDAQAB
oz8wPTAdBgNVHQ4EFgQUiJOyhOerV/35q8ur0gj/nZxqYQAwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBADn2VBr+WKjydy6b
/wGjbnSrYSXZ4zGfCG3qiOvTs0qLBEFZ68MleKrK6gu8IuiPI8ih3t+8pd4BAHTk
kBlgXYkoatLB3ptXkbKC84CUhveQ0tMg+XLUF/N6EhEpC2FViAlYCH/yAs9yFDP/
SUeBrQ78NNd+i3ILNIdlO/hE9v/poPxAEOHMTbmeVPCF92WkRUMjBwbzznvYvE93
oVv4evtCy7TmvSKsTmubmUWk+i5sEJluzs0jorvwea0OOdVcSHAKhAdgyWP904jj
QfLmBXrzLIc5j1UVneOShUCw6y+n2WP/U2YI6jk2kqr8YnOMVxZTBY5DP+dlvApw
KUAHX4N+R/JwVH2rnNV6JbE9nFAow9VtdDeQGorkD1pdgUbTOracVrlVxy6Ybod3
5mNCdfFLIB45HApGd0mW/mLLfZazZCxUaUxgdD9B/xrL1O+0TqyZ6qRqqE34XegM
RADHNUI9CcffYtsSLysMqqm4aLfuZwLFpnPiImcENZEFEgwctg==
-----END CERTIFICATE-----`,
    },
};

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});