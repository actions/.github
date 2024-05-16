- uses: actions/attest-build-provenance@v1
  with:
    # Path to the artifact serving as the subject of the attestation. Must
    # specify exactly one of "subject-path" or "subject-digest".
    subject-path:

    # SHA256 digest of the subject for the attestation. Must be in the form
    # "sha256:hex_digest" (e.g. "sha256:abc123..."). Must specify exactly one
    # of "subject-path" or "subject-digest".
    subject-digest:

    # Subject name as it should appear in the attestation. Required unless
    # "subject-path" is specified, in which case it will be inferred from the
    # path.
    subject-name:

    # Whether to push the attestation to the image registry. Requires that the
    # "subject-name" parameter specify the fully-qualified image name and that
    # the "subject-digest" parameter be specified. Defaults to false.
    push-to-registry:

    # The GitHub token used to make authenticated API requests. Default is
    # ${{ github.token }}
    github-token:
