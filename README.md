# Climate Wrapped API
## Guardian Hack Day September 2021

# Commands

```sh
$ npm i # install dependencies
$ npm run dev # run dev server
$ npm run build # build prod server
$ npm start # run prod server
```

# Routes

## `GET /mp/:postcode`

Gets MP environment voting record by postcode.

Postcode can be in following formats: `"N1 9GU", "N19GU", "N1+9GU"`

Response:
```json
{
    "title": "How Emily Thornberry voted on Environmental Issues",
    "votes": [
        [
            "Generally voted against greater regulation of hydraulic fracturing (fracking) to extract shale gas.",
            "1 vote for, 2 votes against, 1 absence, in 2015."
        ],
        [
            "Generally voted against higher taxes on plane tickets.",
            "0 votes for, 6 votes against, 5 absences, between 2013–2017."
        ],
        [
            "Voted a mixture of for and against lower taxes on fuel for motor vehicles.",
            "6 votes for, 4 votes against, 6 absences, between 2010–2013.            Most current Labour MPs generally voted against (21 votes, between 2010–2013)."
        ],
        [
            "Consistently voted against selling England’s state owned forests.",
            "0 votes for, 2 votes against, in 2011."
        ],
        [
            "Generally voted for financial incentives for low carbon emission electricity generation methods.",
            "4 votes for, 1 vote against, 1 absence, between 2011–2018."
        ],
        [
            "Voted for new high speed rail infrastructure.",
            "1 vote for, 0 votes against, 7 absences, between 2014–2019.            Most current Labour MPs generally voted for (9 votes, between 2013–2019)."
        ],
        [
            "Generally voted for measures to prevent climate change.",
            "17 votes for, 6 votes against, 10 absences, between 2008–2020."
        ],
        [
            "Consistently voted against culling badgers to tackle bovine tuberculosis.",
            "0 votes for, 4 votes against, between 2013–2014."
        ]
    ]
}
```

## `GET /carbon-intensity/:postcode`

Gets current carbon intensity for your postcode.

Only first part of postcode accepted, e.g. `N1 9GU"` becomes `"N1"` -> `GET /carbon-intensity/N1`

Response:
```json
{
    "regionid": 13,
    "dnoregion": "UKPN London",
    "shortname": "London",
    "postcode": "N1",
    "data": [
        {
            "from": "2021-09-16T15:30Z",
            "to": "2021-09-16T16:00Z",
            "intensity": {
                "forecast": 183,
                "index": "moderate"
            },
            "generationmix": [
                {
                    "fuel": "biomass",
                    "perc": 0
                },
                {
                    "fuel": "coal",
                    "perc": 0
                },
                {
                    "fuel": "imports",
                    "perc": 35.4
                },
                {
                    "fuel": "gas",
                    "perc": 40.7
                },
                {
                    "fuel": "nuclear",
                    "perc": 10.6
                },
                {
                    "fuel": "other",
                    "perc": 0
                },
                {
                    "fuel": "hydro",
                    "perc": 0.2
                },
                {
                    "fuel": "solar",
                    "perc": 10
                },
                {
                    "fuel": "wind",
                    "perc": 3.1
                }
            ]
        }
    ]
}
```

## `GET /suppliers`

Get a list of supplier codes and names to use in `GET /suppliers/usage/:code/:usage`

Response:

```json
{
    "suppliers": [
        {
            "code": "affe1",
            "name": "Affect Energy"
        },
        {
            "code": "ange1",
            "name": "Angelic Energy"
        },
        {
            "code": "avro1",
            "name": "Avro Energy"
        },
        {
            "code": "beam1",
            "name": "Beam Energy"
        },
        ...
    ]
}
```

## `GET /suppliers/fuel-mix`

Get fuel mix for all suppliers

fuel is in percentage from range `0-1`
`CO2` is in `g/kWh`
`nuclear waste"` is in `g/kWh`

`year` is the year data is from

Response:

```json
[
    {
        "supplier": "Angelic Energy",
        "coal": 0.6,
        "gas": 3.8,
        "nuclear": 1.1,
        "renewable": 94.3,
        "other": 0.2,
        "CO2": 20,
        "nuclear waste": 0.00008,
        "year": 2019,
        "code": "ange1"
    },
    {
        "supplier": "Avro Energy",
        "coal": 6.3,
        "gas": 72,
        "nuclear": 8.2,
        "renewable": 8.3,
        "other": 5.2,
        "CO2": 377,
        "nuclear waste": 0.00057,
        "year": 2020,
        "code": "avro1"
    },
    {
        "supplier": "Beam Energy",
        "coal": 0.6,
        "gas": 3.8,
        "nuclear": 1.1,
        "renewable": 94.3,
        "other": 0.2,
        "CO2": 20,
        "nuclear waste": 0.00008,
        "year": 2019,
        "code": "beam1"
    },
    ...
]
```

## `GET /suppliers/fuel-mix/:code`

Get fuel mix for a single supplier using it's code, which you can get from `GET /suppliers`

Response
```json
{
    "supplier": "Avro Energy",
    "coal": 6.3,
    "gas": 72,
    "nuclear": 8.2,
    "renewable": 8.3,
    "other": 5.2,
    "CO2": 377,
    "nuclear waste": 0.00057,
    "year": 2020,
    "code": "avro1"
}
```

## `GET /suppliers/usage/:code/:usage`

Get carbon emissions (kg - kilograms) and nuclear waste (g - grams) for a given supplier.

`code` - supplier code from `GET /suppliers`, e.g. `avro1`
`usage` - number of usage in kWh/y (kilowatt hours per year) e.g. `3100`

`GET /suppliers/usage/avro1/3100`

Response:
```json
{
    "emissions": {
        "emissionsKg": 1169,
        "nuclearWasteG": 1.767
    }
}
```