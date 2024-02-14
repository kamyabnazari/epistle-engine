# Dockerfile for Grafana

FROM grafana/grafana:9.4.7

# Create the dashboards directory
RUN mkdir -p /var/lib/grafana/dashboards

# Copy the data source provisioning file
COPY datasources/datasource.yml /etc/grafana/provisioning/datasources/

# Copy the dashboard provisioning file
COPY dashboards/dashboard.yml /etc/grafana/provisioning/dashboards/

# Copy the dashboard JSON files to the created directory
COPY dashboards/prometheus-dashboard-ee-k8s.json /etc/grafana/provisioning/dashboards/
COPY dashboards/prometheus-dashboard-ee-local.json /etc/grafana/provisioning/dashboards/

EXPOSE 3000
