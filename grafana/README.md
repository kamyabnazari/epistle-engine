# Grafana

## Setup

### Change URL if testing localy

Change the url in the README.md, all datasources should actualy be set.

URLs to the datasources:

```
url: http://ee-prometheus:9090
url: http://ee-prometheus.example-namespace-name:9090/
```

### Running Grafana

Use docker compose to create Grafana Service:

```
docker-compose up
```

### Accessing Grafana

Navigate to http://localhost:3050/ or the Deployed URL.

Note:

Initial installation password and usernames are "admin".