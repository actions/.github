# Internal Network Scan Report

- **Date (UTC):** 2026-02-28 21:57:06Z
- **Scanner host IP:** 172.31.1.18
- **Method:** ICMP ping sweep of `172.31.1.0/24`, then TCP connect probes (`nc -z`) on selected common ports.

## Live hosts discovered

- `172.31.1.18`
- `172.31.1.19`
- `172.31.1.20`

## Open ports (tested set)

Tested ports: `22, 53, 80, 111, 443, 2375, 2376, 3306, 5432, 6379, 8080`

- `172.31.1.18`: no open ports detected in tested set
- `172.31.1.19`: `8080` open
- `172.31.1.20`: no open ports detected in tested set

## Commands used

```bash
hostname -I
for i in $(seq 1 254); do
  host=172.31.1.$i
  ping -c 1 -W 1 "$host" >/dev/null 2>&1 && echo "$host"
done

for h in 172.31.1.18 172.31.1.19 172.31.1.20; do
  for p in 22 53 80 111 443 2375 2376 3306 5432 6379 8080; do
    nc -z -w 1 "$h" "$p" >/dev/null 2>&1 && echo "$h:$p"
  done
done
```

