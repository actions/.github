# Kornphan-mine
- 👋 Hello, I'm @Kornphangit branch -m main Tomain

git fetch origin

git branch -u origin/Tomain Tomain

git remote set-head origin -a

- 👀 I’m interested in ...

- 🌱 I’m currently learning ...

- 💞️ I’m looking to collaborate on ...

- 📫 How to reach me ...

<!---

Kornphan/Kornphan-mine is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.

You can click the Preview link to take a look at your changes.

--->

From d9a5ed07725a433e6cbb0c31712979c4cb20b544 Mon Sep 17 00:00:00 2001

From: Kornphan <kronphan2525@gmail.com>

Date: Wed, 27 Oct 2021 00:10:20 +0700

Subject: [PUSH] Create github-actions-demo.yml

---

 .github/workflows/github-actions-demo.yml | 17 +++++++++++++++++

 1 file changed, 17 insertions(+)

 create mode 100644 .github/workflows/github-actions-demo.yml

diff --git a/.github/workflows/github-actions-demo.yml b/.github/workflows/github-actions-demo.yml

new file mode 100644

index 0000000..711d62e

--- /dev/null

+++ b/.github/workflows/github-actions-demo.yml

@@ -0,0 +1,17 @@

+name: GitHub Actions Demo

+on: [push]

+jobs:

+  Explore-GitHub-Actions:

+    runs-on: ubuntu-latest

+    steps:

+      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."

+      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"

+      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."

+      - name: Check out repository code

+        uses: actions/checkout@v2

+      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."

+      - run: echo "🖥️ The workflow is now ready to test your code on the runner."

+      - name: List files in the repository

+        run: |

+          ls ${{ github.workspace }}

+      - run: echo "🍏 This job's status is ${{job's.status }}."
