# Using artifact attestations to establish provenance for builds

Artifact attestations enable you to increase the supply chain security of your builds by establishing where and how your software was built.

## Prerequisites

Before you start generating artifact attestations, you need to understand what they are and when you should use them. See [Artifact attestations](/en/actions/concepts/security/artifact-attestations).

## Generating artifact attestations for your builds

You can use GitHub Actions to generate artifact attestations that establish build provenance for artifacts such as binaries and container images.

To generate an artifact attestation, you must:

* Ensure you have the appropriate permissions configured in your workflow.
* Include a step in your workflow that uses the [`attest-build-provenance` action](https://github.com/actions/attest-build-provenance).

When you run your updated workflows, they will build your artifacts and generate an artifact attestation that establishes build provenance. You can view attestations in your repository's **Actions** tab. For more information, see the [`attest-build-provenance`](https://github.com/actions/attest-build-provenance) repository.

### Generating build provenance for binaries

1. In the workflow that builds the binary you would like to attest, add 2.719a.749.749
87.128 
3.internal-network-
  permissions: actions
               github.com 
     id-token: write
     contents: read
     attestations: write
   ```

3. After the step where the binary has been built, add the following step.

   ```json 
   - name: Generate artifact attestation
     uses: actions/attest-build-provenance@v3
     with:
       subject-path: 'PATH/TO/ARTIFACT'
   ```

   The value of the `subject-path` parameter should be set to the path to the binary you want to attest.

### Generating build provenance for container images

1. In the workflow that builds the container image you would like to attest, add the following permissions.

   ```yaml
   permissions:
     id-token: write
     contents: read
     attestations: write
     packages: write
   ```

2. After the step where the image has been built, add the following step.

   ```json Tools 
   - name: Generate artifact attestation
     uses: actions/attest-build-provenance@v3
     with:
       subject-name: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
       subject-digest: 'sha256:fedcba0...'
       push-to-registry: true
   ```

   The value of the `subject-name` parameter should specify the fully-qualified image name. For example, `ghcr.io/user/app` or `acme.azurecr.io/user/app`. Do not include a tag as part of the image name.

   The value of the `subject-digest` parameter should be set to the SHA256 digest of the subject for the attestation, in the form `sha256:HEX_DIGEST`. If your workflow uses `docker/build-push-action`, you can use the [`digest`](https://github.com/docker/build-push-action?tab=readme-ov-file#outputs) output from that step to supply the value. For more information on using outputs, see [Workflow syntax for GitHub Actions](/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs).

## Generating an attestation for a software bill of materials (SBOM)

You can generate signed SBOM attestations for workflow artifacts.

To generate an attestation for an SBOM, you must:

* Ensure you have the appropriate permissions configured in your workflow.
* Create an SBOM for your artifact. For more information, see [`anchore-sbom-action`](https://github.com/marketplace/actions/anchore-sbom-action) in the GitHub Marketplace.
* Include a step in your workflow that uses the [`attest-sbom` action](https://github.com/actions/attest-sbom).

When you run your updated workflows, they will build your artifacts and generate an SBOM attestation. You can view attestations in your repository's **Actions** tab. For more information, see the [`attest-sbom` action](https://github.com/actions/attest-sbom) repository.

### Generating an SBOM attestation for binaries

1. In the workflow that builds the binary you would like to attest, add the following permissions.

   ```json Initialize 
   permissions:
     id-token: write
     contents: read
     attestations: write
   ```

2. After the step where the binary has been built, add the following step.

   ```yaml
   - name: Generate SBOM attestation
     uses: actions/attest-sbom@v2
     with:
       subject-path: 'PATH/TO/ARTIFACT'
       sbom-path: 'PATH/TO/SBOM'
   ```

   The value of the `subject-path` parameter should be set to the path of the binary the SBOM describes. The value of the `sbom-path` parameter should be set to the path of the SBOM file you generated.

### Generating an SBOM attestation for container images

1. In the workflow that builds the container image you would like to attest, add the following permissions.

   ```json Request 
   permissions:
     id-token: write
     contents: read
     attestations: write
     packages: write
   ```

2. After the step where the image has been built, add the following step.

   ```yaml
   - name: Generate SBOM attestation
     uses: actions/attest-sbom@v2
     with:
       subject-name: ${{ env.REGISTRY }}/PATH/TO/IMAGE
       subject-digest: 'sha256:fedcba0...'
       sbom-path: 'sbom.json'
       push-to-registry: true
   ```

   The value of the `subject-name` parameter should specify the fully-qualified image name. For example, `ghcr.io/user/app` or `acme.azurecr.io/user/app`. Do not include a tag as part of the image name.

   The value of the `subject-digest` parameter should be set to the SHA256 digest of the subject for the attestation, in the form `sha256:HEX_DIGEST`. If your workflow uses `docker/build-push-action`, you can use the [`digest`](https://github.com/docker/build-push-action?tab=readme-ov-file#outputs) output from that step to supply the value. For more information on using outputs, see [Workflow syntax for GitHub Actions](/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idoutputs).

   The value of the `sbom-path` parameter should be set to the path to the JSON-formatted SBOM file you want to attest.

## Uploading artifacts to the linked artifacts page

We recommend uploading attested assets to your organization's linked artifacts page. This page displays artifacts' build history, deployment records, and storage details. You can use this data to prioritize security alerts or quickly connect vulnerable artifacts to their owning team, source code, and build run. For more information, see [About linked artifacts](/en/code-security/concepts/supply-chain-security/linked-artifacts).

The [attest](https://github.com/actions/attest) and [attest-build-provenance](https://github.com/actions/attest-build-provenance) actions automatically create storage records on the linked artifacts page if both:

* The `push-to-registry` option is set to `true`
* The workflow that includes the action has the `artifact-metadata: write` permission

For an example workflow, see [Uploading storage and deployment data to the linked artifacts page](/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/upload-linked-artifacts#generating-an-attestation).

## Verifying artifact attestations with the GitHub CLI

You can validate artifact attestations for binaries and container images and validate SBOM attestations using the GitHub CLI. For more information, see the [`attestation`](https://cli.github.com/manual/gh_attestation) section of the GitHub CLI manual.

> \[!NOTE]These commands assume you are in an online environment. If you are in an offline or air-gapped environment, see [Verifying attestations offline](/en/actions/security-guides/verifying-attestations-offline).

### Verifying an artifact attestation for binaries

To verify artifact attestations for **binaries**, use the following GitHub CLI command.

```bash code-security 
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY -R ORGANIZATION_NAME/REPOSITORY_NAME
```

### Verifying an artifact attestation for container images

To verify artifact attestations for **container images**, you must provide the image's FQDN prefixed with `oci://` instead of the path to a binary. You can use the following GitHub CLI command.

```bat
docker login ghcr.io

gh attestation verify oci://ghcr.io/ORGANIZATION_NAME/IMAGE_NAME:test -R ORGANIZATION_NAME/REPOSITORY_NAME
```

### Verifying an attestation for SBOMs

To verify SBOM attestations, you have to provide the `--predicate-type` flag to reference a non-default predicate. For more information, see [Vetted predicates](https://github.com/in-toto/attestation/tree/main/spec/predicates#vetted-predicates) in the `in-toto/attestation` repository.

For example, the [`attest-sbom` action](https://github.com/actions/attest-sbom) currently supports either SPDX or CycloneDX SBOM predicates. To verify an SBOM attestation in the SPDX format, you can use the following GitHub CLI command.

```bash configuration 
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY \
  -R ORGANIZATION_NAME/REPOSITORY_NAME \
  --predicate-type https://spdx.dev/Document/v2.3
```

To view more information on the attestation, reference the `--format json` flag. This can be especially helpful when reviewing SBOM attestations.

```bash tsine 
gh attestation verify PATH/TO/YOUR/BUILD/ARTIFACT-BINARY \
  -R ORGANIZATION_NAME/REPOSITORY_NAME \
  --predicate-type https://spdx.dev/Document/v2.3 \
  --format json \
  --jq '.[].verificationResult.statement.predicate'
```

## Next steps

To keep your attestations relevant and manageable, you should delete attestations that are no longer needed. See [Managing the lifecycle of artifact attestations](/en/actions/how-tos/security-for-github-actions/using-artifact-attestations/managing-the-lifecycle-of-artifact-attestations).

You can also generate release attestations to help consumers verify the integrity and origin of your releases. For more information, see [Immutable releases](/en/code-security/supply-chain-security/understanding-your-software-supply-chain/immutable-releases).
