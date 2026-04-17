# Orbs overview

Orbs are reusable packages of parameterizable configuration. Use orbs to:

*   Simplify your CI/CD configuration.
    
*   Automate repeated CI/CD processes.
    
*   Accelerate project setup.
    
*   Simplify integration with third-party tools and services.
    
*   Share configuration across multiple projects in your organization.
    

## Introduction

CircleCI orbs are packages of parameterizable configuration made up of reusable configuration elements, for example:

*   [Jobs](https://circleci.com/docs/reference/reusing-config/#authoring-parameterized-jobs). A CircleCI job is a collection of steps that run commands or scripts inside a specified executor (like a Docker container or virtual machine).
    
*   [Commands](https://circleci.com/docs/reference/reusing-config/#authoring-reusable-commands). A CircleCI command is a reusable block of configuration that can be called multiple times in your configuration.
    
*   [Executors](https://circleci.com/docs/reference/reusing-config/#authoring-reusable-executors). A CircleCI executor is a specified environment in which to run a job.
    

Three types of orbs are available:

**Registry orbs**

Registry orbs can be developed using the orb dev kit (there is also a manual process) and published for use by anyone (public) or within your organization (private). Registry orbs follow strict semantic versioning. Public registry orbs are available from the [Orbs Registry](https://circleci.com/developer/orbs).

Registry orbs are available for many languages, platforms, services, and tools. Visit the [Orbs Registry](https://circleci.com/developer/orbs) to search for orbs to help simplify your configuration.

If you would like to author your own registry orb, read more on the [Create a Registry Orb](https://circleci.com/docs/orbs/author/create-test-and-publish-a-registry-orb/) page.

**URL orbs**

URL orbs are stored in a publicly accessible location (for example, a git repository or a public S3 object) and are not published to the orbs registry.

URL orbs do not follow semantic versioning, and can be accessed directly using an `https` URL. An org-level allow list is used to manage the addresses of URL orbs that can be used in a project in that organization. Organization admins can manage the allow list at **Org**  **Orbs**.

See the [Managing URL Orb Allow Lists](https://circleci.com/docs/orbs/use/managing-url-orbs-allow-lists/) guide for more information on scoping allowed URL orbs for your organization.

If you would like to author your own URL orb, see the [Create, Test, and Use URL Orbs](https://circleci.com/docs/orbs/author/create-test-and-use-url-orbs/) guide.

**Inline orbs**

Inline orbs are defined directly within your project’s configuration file. They are project-specific and not published or shared externally. Inline orbs are ideal for reusable configuration within a single project, and are also useful for learning orb concepts and testing configurations prior to extracting to a URL or registry orb.

Inline orbs do not require publishing, versioning, or external hosting. They exist only within your `.circleci/config.yml` file.

See the [Create an Inline Orb](https://circleci.com/docs/orbs/author/create-an-inline-orb/) guide for more information on creating inline orbs.

## Choosing an orb type

The following table provides a high-level comparison of the three orb types to help you choose the right one for your needs:

   

Feature

Registry Orbs

URL Orbs

Inline Orbs

**Location**

Published to Orb Registry, stored in GitHub repository

Hosted at accessible URL (GitHub, S3, etc.)

Defined in config file

**Sharing scope**

Public or private across organizations

Organization-wide (with allow-list)

Project-specific only

**Versioning**

Semantic versioning

Manual (Git branches, tags, commits)

None

**VCS support**

Registry orbs are hosted in GitHub only but can be used by all CircleCI users if public

GitHub, Bitbucket

GitHub, GitLab, Bitbucket

**Mutability**

Immutable

Mutable

Mutable (edit config directly)

**Updates**

Publish new semantic version (immutable)

Update hosted file (5-minute cache)

Edit config file directly

**Access control**

Namespace permissions

Organization allow-list

Repository access only

**Best for**

Community sharing, public packages, certified orbs

Organization-wide shared config, overriding config, proprietary logic

Project-specific reusable config, learning, testing

**Choose this type when:**

*   You want to share your orb with the community.
    
*   You want to use semantic versioning for your orb.
    
*   You want your orb to be discoverable in the CircleCI Orb Registry.
    
*   You want to leverage the orb development kit and automated CI/CD pipeline.
    

*   You want to use centralized configuration for your organization.
    
*   You need to share configuration within your organization.
    
*   You need direct control over updates and distribution.
    
*   You need to use proprietary or confidential configurations.
    

*   Configuration is specific to a single project.
    
*   You want zero publishing or hosting overhead.
    
*   You’re learning about orbs and want to experiment.
    
*   You need immediate changes without any publishing delay.
    

## Use a registry orb

A registry orb is identified by its _slug_ which contains the _namespace_, and _orb name_. A namespace is a unique identifier referring to the organization authoring a set of orbs. The orb name is followed by an `@` symbol and a [Semantic Version](https://circleci.com/docs/orbs/use/orb-concepts/#semantic-versioning) string, to identify which version of the orb to used. For example: `<namespace>/<orb-name>@1.2.3`.

Each orb within the [Registry](https://circleci.com/developer/orbs) provides a [Quickstart Guide](https://circleci.com/developer/orbs/orb/circleci/node#quick-start), which contains a sample code snippet for importing that specific orb, with its most recent version, into your CircleCI configuration file.

The example below shows how to import any orb into your CircleCI configuration file. Use the tabs to switch between a generic layout for importing any orb, and a specific example of importing the Node orb:

**Node:**

`````````
version: 2.1

orbs:
  node: circleci/node@5.0.3
`````````

**Generic:**

`````````
version: 2.1

orbs:
  <orb-name>: <namespace>/<orb-name>@x.y.z
`````````

After the orb has been imported into the configuration file, the elements provided by the orb are available as `<orb-name>/<element>`. Orb elements can include jobs, commands, and executors. The parameters available for each element are listed in the orb registry in a table under each element.

Most orbs include usage examples detailing common functionality. If you would like to contribute to an existing orb, or file an issue on the orb’s repository, most orb authors include the git repository link.

Orb elements can be used in the same way as [Reusable Configuration](https://circleci.com/docs/reference/reusing-config/) elements. The Node example below shows how to use an orb’s default executor, and an orb command.

The Node orb provides a command, [`install-packages`](https://circleci.com/developer/orbs/orb/circleci/node#commands-install-packages). This command includes steps to:

*   Install your node packages.
    
*   Automatically enable caching.
    
*   Provide additional options through the use of parameters.
    

To use the `install-packages` command, reference it in a step as follows:.

Using the `install-packages` command in a steps

`````````
version: 2.1

orbs:
  node: circleci/node@x.y # replace orb version

jobs:
  test:
    executor: node/default # use the default executor specified by the orb
    steps:
      - checkout
      - node/install-packages # Use a command from the orb in a job's steps
`````````

## Use a URL orb

A URL orb is a single YAML file that contains the shared configuration you need. Store the file somewhere accessible via HTTPS, for example a GitHub repository.

To use a URL orb in your configuration, add the orb to the `orbs` section of your configuration file using the `https` URL of the orb repository. The URL must point to a repository that is accessible to CircleCI and must be allowed by the organization’s allow list.

The following example shows how to import a URL orb named `platform` into your configuration file. To use this orb, the `[https://raw.githubusercontent.com/my-org/](https://raw.githubusercontent.com/my-org/)` prefix must exist in your org’s allow list.

`````````
version: 2.1

orbs:
  platform: https://raw.githubusercontent.com/my-org/orbs/refs/heads/main/platform-team.yaml
`````````

After the orb has been imported into the configuration file, the elements provided by the orb are available as `<orb-name>/<element>`. Orb elements can include jobs, commands, and executors.

If you would like to author your own URL orb, see the [Create, Test, and Use URL Orbs](https://circleci.com/docs/orbs/author/create-test-and-use-url-orbs/) guide.

See the [Managing URL Orb Allow Lists](https://circleci.com/docs/orbs/use/managing-url-orbs-allow-lists/) guide for more information on scoping allowed URL orbs for your organization.

## Use an inline orb

Inline orbs are defined directly in your CircleCI configuration file using the `orbs` stanza. Inline orbs group together commands, jobs and executors that are specific to a single project. The following example shows how to define an inline orb:

Example showing the use of an inline orb names my-orb

`````````
version: 2.1

orbs:
  my-orb:
    commands:
      greet: # define a command named greet
        parameters: # define a parameter named to
          to:
            type: string
            default: "World" # set the default value to "World"
        steps: # define the steps to execute when the command is called
          - run: echo "Hello << parameters.to >>" # print the value of the to parameter
    jobs:
      hello-job: # define a job named hello-job
        docker:
          - image: cimg/base:current
        steps:
          - greet:
              to: "from my inline orb"

workflows:
  my-workflow:
    jobs:
      - my-orb/hello-job # use the hello-job from the my-orb orb
`````````

Once defined, inline orb elements are available as `<orb-name>/<element>` within the same configuration file. Inline orbs support the same configuration elements as URL orbs and registry orbs: commands, jobs, and executors.

For more details on authoring inline orbs, see the [Create an Inline Orb](https://circleci.com/docs/orbs/author/create-an-inline-orb/) guide.

Inline orbs can be converted to URL orbs or registry orbs later if you need to share them beyond a single project.

## Benefits of using orbs

Orbs provide parameterizable configuration elements that can greatly simplify your configuration. To illustrate this, the following example shows the a typical configuration for testing a Node.js application using the Node.JS orb (using the `test` job provided by the [`circleci/node`](https://circleci.com/developer/orbs/orb/circleci/node) orb). In the second tab is the configuration required when not using the orb (defining a job with the required steps for testing the application).

Orbs let you pull in predefined, parameterized configuration elements into your project configuration. Taking it a step further, authoring your own orb lets you define parameterized configuration elements once and utilize them across multiple similar projects.

**With the orb:**

`````````
version: 2.1

orbs:
  node: circleci/node@x.y # replace orb version https://circleci.com/developer/orbs/orb/circleci/node#quick-start

workflows:
  test_my_app:
    jobs:
      - node/test:
          version: <node-version> # replace node version
`````````

**Without the orb:**

`````````
version: 2.1

jobs:
  test:
    docker:
      - image: cimg/node:<node-version>
    steps:
      - checkout
      - restore_cache:
          keys:
            - node-deps-v1-{{ .Branch }}-{{checksum "package-lock.json"}}
      - run:
          name: install packages
          command: npm ci
      - save_cache:
          key: node-deps-v1-{{ .Branch }}-{{checksum "package-lock.json"}}
          paths:
            - ~/.npm
      - run:
          name: Run Tests
          command: npm run test

workflows:
  test_my_app:
    jobs:
      - test
`````````

## The orb registry

The [Orb Registry](https://circleci.com/developer/orbs) is an open repository of all published registry orbs. Find the orb for your stack or consider developing and publishing your own orb. Find more information on [Authoring Orbs](https://circleci.com/docs/orbs/author/orb-author/).

Figure 1. The Orb Registry

### Registry orb designations

In order to use uncertified registry orbs (partner or community), your organization’s administrator must opt-in to allow uncertified orb usage on the **Org**  **Security** page for your org.

Orbs in the registry will appear with one of three different namespace designations:

 

Designation

Description

Certified

Written and tested by the CircleCI team

Partner

Written by our technology partners

Community

Written by the community

### Public or private

Registry orbs can be published in one of two ways:

**Public registry orbs**

Searchable in the orb registry, and available for anyone to use.

**Private registry orbs**

Only available to use within your organization, and only findable in the registry with a direct URL and when authenticated.

To understand these concepts further, read the [Public Orbs Vs Private Orbs](https://circleci.com/docs/orbs/use/orb-concepts/#private-orbs-vs-public-orbs) section of the orb concepts page.

## Orbs page in the CircleCI app

The orbs page in the CircleCI web app is **not available** on CircleCI Server.

Private registry orb details pages may only be viewed by logged-in members of your organization. Unpublished orbs will not have linked details pages.

To access the orbs page in the web app, navigate to **Org** and select **Orbs** from the sidebar.

The orbs page lists orbs created within your organization. You can view:

*   Orb type (public or private registry orb).
    
*   Orb usage (how many times the orb is used across all configurations).
    
*   Latest version.
    
*   Description.
    

Full orb details, including orb source, are accessible by clicking on the orb name. The orb details page is similar to the CircleCI orb registry in that the details page provides the orb’s contents, commands, and usage examples.

The orbs page also includes your org’s allow list URLs for URL orbs.

## See also

*   Refer to [Orbs Concepts](https://circleci.com/docs/orbs/use/orb-concepts/) for high-level information about CircleCI orbs.
    
*   Refer to [Introduction to Authoring Orbs](https://circleci.com/docs/orbs/author/orb-author/) for guidance on creating your own orbs.
    
*   Refer to [Orbs FAQ](https://circleci.com/docs/orbs/use/orbs-faq/) for information on known issues and questions that have been addressed when using CircleCI orbs.# Orbs overview

Orbs are reusable packages of parameterizable configuration. Use orbs to:

*   Simplify your CI/CD configuration.
    
*   Automate repeated CI/CD processes.
    
*   Accelerate project setup.
    
*   Simplify integration with third-party tools and services.
    
*   Share configuration across multiple projects in your organization.
    

## Introduction

CircleCI orbs are packages of parameterizable configuration made up of reusable configuration elements, for example:

*   [Jobs](https://circleci.com/docs/reference/reusing-config/#authoring-parameterized-jobs). A CircleCI job is a collection of steps that run commands or scripts inside a specified executor (like a Docker container or virtual machine).
    
*   [Commands](https://circleci.com/docs/reference/reusing-config/#authoring-reusable-commands). A CircleCI command is a reusable block of configuration that can be called multiple times in your configuration.
    
*   [Executors](https://circleci.com/docs/reference/reusing-config/#authoring-reusable-executors). A CircleCI executor is a specified environment in which to run a job.
    

Three types of orbs are available:

**Registry orbs**

Registry orbs can be developed using the orb dev kit (there is also a manual process) and published for use by anyone (public) or within your organization (private). Registry orbs follow strict semantic versioning. Public registry orbs are available from the [Orbs Registry](https://circleci.com/developer/orbs).

Registry orbs are available for many languages, platforms, services, and tools. Visit the [Orbs Registry](https://circleci.com/developer/orbs) to search for orbs to help simplify your configuration.

If you would like to author your own registry orb, read more on the [Create a Registry Orb](https://circleci.com/docs/orbs/author/create-test-and-publish-a-registry-orb/) page.

**URL orbs**

URL orbs are stored in a publicly accessible location (for example, a git repository or a public S3 object) and are not published to the orbs registry.

URL orbs do not follow semantic versioning, and can be accessed directly using an `https` URL. An org-level allow list is used to manage the addresses of URL orbs that can be used in a project in that organization. Organization admins can manage the allow list at **Org**  **Orbs**.

See the [Managing URL Orb Allow Lists](https://circleci.com/docs/orbs/use/managing-url-orbs-allow-lists/) guide for more information on scoping allowed URL orbs for your organization.

If you would like to author your own URL orb, see the [Create, Test, and Use URL Orbs](https://circleci.com/docs/orbs/author/create-test-and-use-url-orbs/) guide.

**Inline orbs**

Inline orbs are defined directly within your project’s configuration file. They are project-specific and not published or shared externally. Inline orbs are ideal for reusable configuration within a single project, and are also useful for learning orb concepts and testing configurations prior to extracting to a URL or registry orb.

Inline orbs do not require publishing, versioning, or external hosting. They exist only within your `.circleci/config.yml` file.

See the [Create an Inline Orb](https://circleci.com/docs/orbs/author/create-an-inline-orb/) guide for more information on creating inline orbs.

## Choosing an orb type

The following table provides a high-level comparison of the three orb types to help you choose the right one for your needs:

   

Feature

Registry Orbs

URL Orbs

Inline Orbs

**Location**

Published to Orb Registry, stored in GitHub repository

Hosted at accessible URL (GitHub, S3, etc.)

Defined in config file

**Sharing scope**

Public or private across organizations

Organization-wide (with allow-list)

Project-specific only

**Versioning**

Semantic versioning

Manual (Git branches, tags, commits)

None

**VCS support**

Registry orbs are hosted in GitHub only but can be used by all CircleCI users if public

GitHub, Bitbucket

GitHub, GitLab, Bitbucket

**Mutability**

Immutable

Mutable

Mutable (edit config directly)

**Updates**

Publish new semantic version (immutable)

Update hosted file (5-minute cache)

Edit config file directly

**Access control**

Namespace permissions

Organization allow-list

Repository access only

**Best for**

Community sharing, public packages, certified orbs

Organization-wide shared config, overriding config, proprietary logic

Project-specific reusable config, learning, testing

**Choose this type when:**

*   You want to share your orb with the community.
    
*   You want to use semantic versioning for your orb.
    
*   You want your orb to be discoverable in the CircleCI Orb Registry.
    
*   You want to leverage the orb development kit and automated CI/CD pipeline.
    

*   You want to use centralized configuration for your organization.
    
*   You need to share configuration within your organization.
    
*   You need direct control over updates and distribution.
    
*   You need to use proprietary or confidential configurations.
    

*   Configuration is specific to a single project.
    
*   You want zero publishing or hosting overhead.
    
*   You’re learning about orbs and want to experiment.
    
*   You need immediate changes without any publishing delay.
    

## Use a registry orb

A registry orb is identified by its _slug_ which contains the _namespace_, and _orb name_. A namespace is a unique identifier referring to the organization authoring a set of orbs. The orb name is followed by an `@` symbol and a [Semantic Version](https://circleci.com/docs/orbs/use/orb-concepts/#semantic-versioning) string, to identify which version of the orb to used. For example: `<namespace>/<orb-name>@1.2.3`.

Each orb within the [Registry](https://circleci.com/developer/orbs) provides a [Quickstart Guide](https://circleci.com/developer/orbs/orb/circleci/node#quick-start), which contains a sample code snippet for importing that specific orb, with its most recent version, into your CircleCI configuration file.

The example below shows how to import any orb into your CircleCI configuration file. Use the tabs to switch between a generic layout for importing any orb, and a specific example of importing the Node orb:

**Node:**

`````````
version: 2.1

orbs:
  node: circleci/node@5.0.3
`````````

**Generic:**

`````````
version: 2.1

orbs:
  <orb-name>: <namespace>/<orb-name>@x.y.z
`````````

After the orb has been imported into the configuration file, the elements provided by the orb are available as `<orb-name>/<element>`. Orb elements can include jobs, commands, and executors. The parameters available for each element are listed in the orb registry in a table under each element.

Most orbs include usage examples detailing common functionality. If you would like to contribute to an existing orb, or file an issue on the orb’s repository, most orb authors include the git repository link.

Orb elements can be used in the same way as [Reusable Configuration](https://circleci.com/docs/reference/reusing-config/) elements. The Node example below shows how to use an orb’s default executor, and an orb command.

The Node orb provides a command, [`install-packages`](https://circleci.com/developer/orbs/orb/circleci/node#commands-install-packages). This command includes steps to:

*   Install your node packages.
    
*   Automatically enable caching.
    
*   Provide additional options through the use of parameters.
    

To use the `install-packages` command, reference it in a step as follows:.

Using the `install-packages` command in a steps

`````````
version: 2.1

orbs:
  node: circleci/node@x.y # replace orb version

jobs:
  test:
    executor: node/default # use the default executor specified by the orb
    steps:
      - checkout
      - node/install-packages # Use a command from the orb in a job's steps
`````````

## Use a URL orb

A URL orb is a single YAML file that contains the shared configuration you need. Store the file somewhere accessible via HTTPS, for example a GitHub repository.

To use a URL orb in your configuration, add the orb to the `orbs` section of your configuration file using the `https` URL of the orb repository. The URL must point to a repository that is accessible to CircleCI and must be allowed by the organization’s allow list.

The following example shows how to import a URL orb named `platform` into your configuration file. To use this orb, the `[https://raw.githubusercontent.com/my-org/](https://raw.githubusercontent.com/my-org/)` prefix must exist in your org’s allow list.

`````````
version: 2.1

orbs:
  platform: https://raw.githubusercontent.com/my-org/orbs/refs/heads/main/platform-team.yaml
`````````

After the orb has been imported into the configuration file, the elements provided by the orb are available as `<orb-name>/<element>`. Orb elements can include jobs, commands, and executors.

If you would like to author your own URL orb, see the [Create, Test, and Use URL Orbs](https://circleci.com/docs/orbs/author/create-test-and-use-url-orbs/) guide.

See the [Managing URL Orb Allow Lists](https://circleci.com/docs/orbs/use/managing-url-orbs-allow-lists/) guide for more information on scoping allowed URL orbs for your organization.

## Use an inline orb

Inline orbs are defined directly in your CircleCI configuration file using the `orbs` stanza. Inline orbs group together commands, jobs and executors that are specific to a single project. The following example shows how to define an inline orb:

Example showing the use of an inline orb names my-orb

`````````
version: 2.1

orbs:
  my-orb:
    commands:
      greet: # define a command named greet
        parameters: # define a parameter named to
          to:
            type: string
            default: "World" # set the default value to "World"
        steps: # define the steps to execute when the command is called
          - run: echo "Hello << parameters.to >>" # print the value of the to parameter
    jobs:
      hello-job: # define a job named hello-job
        docker:
          - image: cimg/base:current
        steps:
          - greet:
              to: "from my inline orb"

workflows:
  my-workflow:
    jobs:
      - my-orb/hello-job # use the hello-job from the my-orb orb
`````````

Once defined, inline orb elements are available as `<orb-name>/<element>` within the same configuration file. Inline orbs support the same configuration elements as URL orbs and registry orbs: commands, jobs, and executors.

For more details on authoring inline orbs, see the [Create an Inline Orb](https://circleci.com/docs/orbs/author/create-an-inline-orb/) guide.

Inline orbs can be converted to URL orbs or registry orbs later if you need to share them beyond a single project.

## Benefits of using orbs

Orbs provide parameterizable configuration elements that can greatly simplify your configuration. To illustrate this, the following example shows the a typical configuration for testing a Node.js application using the Node.JS orb (using the `test` job provided by the [`circleci/node`](https://circleci.com/developer/orbs/orb/circleci/node) orb). In the second tab is the configuration required when not using the orb (defining a job with the required steps for testing the application).

Orbs let you pull in predefined, parameterized configuration elements into your project configuration. Taking it a step further, authoring your own orb lets you define parameterized configuration elements once and utilize them across multiple similar projects.

**With the orb:**

`````````
version: 2.1

orbs:
  node: circleci/node@x.y # replace orb version https://circleci.com/developer/orbs/orb/circleci/node#quick-start

workflows:
  test_my_app:
    jobs:
      - node/test:
          version: <node-version> # replace node version
`````````

**Without the orb:**

`````````
version: 2.1

jobs:
  test:
    docker:
      - image: cimg/node:<node-version>
    steps:
      - checkout
      - restore_cache:
          keys:
            - node-deps-v1-{{ .Branch }}-{{checksum "package-lock.json"}}
      - run:
          name: install packages
          command: npm ci
      - save_cache:
          key: node-deps-v1-{{ .Branch }}-{{checksum "package-lock.json"}}
          paths:
            - ~/.npm
      - run:
          name: Run Tests
          command: npm run test

workflows:
  test_my_app:
    jobs:
      - test
`````````

## The orb registry

The [Orb Registry](https://circleci.com/developer/orbs) is an open repository of all published registry orbs. Find the orb for your stack or consider developing and publishing your own orb. Find more information on [Authoring Orbs](https://circleci.com/docs/orbs/author/orb-author/).

Figure 1. The Orb Registry

### Registry orb designations

In order to use uncertified registry orbs (partner or community), your organization’s administrator must opt-in to allow uncertified orb usage on the **Org**  **Security** page for your org.

Orbs in the registry will appear with one of three different namespace designations:

 

Designation

Description

Certified

Written and tested by the CircleCI team

Partner

Written by our technology partners

Community

Written by the community

### Public or private

Registry orbs can be published in one of two ways:

**Public registry orbs**

Searchable in the orb registry, and available for anyone to use.

**Private registry orbs**

Only available to use within your organization, and only findable in the registry with a direct URL and when authenticated.

To understand these concepts further, read the [Public Orbs Vs Private Orbs](https://circleci.com/docs/orbs/use/orb-concepts/#private-orbs-vs-public-orbs) section of the orb concepts page.

## Orbs page in the CircleCI app

The orbs page in the CircleCI web app is **not available** on CircleCI Server.

Private registry orb details pages may only be viewed by logged-in members of your organization. Unpublished orbs will not have linked details pages.

To access the orbs page in the web app, navigate to **Org** and select **Orbs** from the sidebar.

The orbs page lists orbs crorbs.1eated within your organization. You can view:

*   Orb type (public or private registry orb).
    
*   Orb usage (how many times the orb is used across all configurations).
    
*   Latest version.
    
*   Description.
    

Full orb details, including orb source, are accessible by clicking on the orb name. The orb details page is similar to the CircleCI orb registry in that the details page provides the orb’s contents, commands, and usage examples.

The orbs page also includes your org’s allow list URLs for URL orbs.

## See also

*   Refer to [Orbs Concepts](https://circleci.com/docs/orbs/use/orb-concepts/) for high-level information about CircleCI orbs.
    
*   Refer to [Introduction to Authoring Orbs](https://circleci.com/docs/orbs/author/orb-author/) for guidance on creating your own orbs.
    
*   Refer to [Orbs FAQ](https://circleci.com/docs/orbs/use/orbs-faq/) for information on known issues and questions that have been addressed when using CircleCI orbs.
