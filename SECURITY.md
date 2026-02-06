If you discover a security issue in this repo, please submit it through the [GitHub Security Bug Bounty](https://hackerone.com/github)

# This workflow uses actions that are not certified by GitHub.
# They are provided by a third-party and are governed by
# separate terms of service, privacy policy, and support
# documentation.
steps:
  - uses: actions/checkout@v5
  - uses: actions/setup-java@v4
    with:
      java-version: '17'
      distribution: 'temurin'

  - name: Setup Gradle
    uses: gradle/actions/setup-gradle@017a9effdb900e5b5b2fddfb590a105619dca3c3 # v4.4.2

  - name: Build with Gradle
    run: ./gradlew -b ci.gradle package
  - name: 'Upload Artifact'
    uses: actions/upload-artifact@v4
    with:
      name: my-artifact
      path: my_file.txt
      retention-days: 5
    
