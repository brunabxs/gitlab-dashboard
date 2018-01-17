<a name="1.1.1"></a>
## [1.1.1](https://github.com/brunabxs/gitlab-dashboard/compare/v1.1.0...v1.1.1) (2018-01-17)


### Bug Fixes

* Run storage upgrade after version update ([1479aa4](https://github.com/brunabxs/gitlab-dashboard/commit/1479aa4))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/brunabxs/gitlab-dashboard/compare/v1.0.0...v1.1.0) (2018-01-12)


### Bug Fixes

* Ensure OnDemand objects update method is called after some seconds instead of every second ([90758e7](https://github.com/brunabxs/gitlab-dashboard/commit/90758e7))
* Update command to generate package version ([2be242a](https://github.com/brunabxs/gitlab-dashboard/commit/2be242a))


### Features

* Improve dashboard design ([f32e671](https://github.com/brunabxs/gitlab-dashboard/commit/f32e671))
* Load legacy storage information ([a8b66bb](https://github.com/brunabxs/gitlab-dashboard/commit/a8b66bb))
* Remove unnecessary vcs and project sections in dashboard ([599868b](https://github.com/brunabxs/gitlab-dashboard/commit/599868b))
* Store serialized VCSs ([5adcb27](https://github.com/brunabxs/gitlab-dashboard/commit/5adcb27))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.16...v1.0.0) (2017-12-28)


### Features

* Add test stage ([763b989](https://github.com/brunabxs/gitlab-dashboard/commit/763b989))
* Add unit tests ([d752743](https://github.com/brunabxs/gitlab-dashboard/commit/d752743))
* Allow users to define multiple version control systems and configure its projects and branches to be displayed in dashboard ([f1a6af6](https://github.com/brunabxs/gitlab-dashboard/commit/f1a6af6))
* Move 'lint' task to 'test' task and remove 'test' task from 'build' task ([665fd72](https://github.com/brunabxs/gitlab-dashboard/commit/665fd72))


### BREAKING CHANGES

* Previously, the user was not allowed to include projects from different version control systems. This new version has no compatibility with previous versions, so the user must redefine their projects settings.



<a name="0.0.16"></a>
## [0.0.16](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.15...v0.0.16) (2017-11-02)


### Features

* Allow publish extension for Mozilla Firefox and Google Chrome browsers ([a6f26c4](https://github.com/brunabxs/gitlab-dashboard/commit/a6f26c4))
* Remove KnockoutJS reference from dashboard and use AngularJS instead ([cc90589](https://github.com/brunabxs/gitlab-dashboard/commit/cc90589))



<a name="0.0.15"></a>
## [0.0.15](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.14...v0.0.15) (2017-10-05)


### Features

* Allow multiple branches for the same project ([b51eb65](https://github.com/brunabxs/gitlab-dashboard/commit/b51eb65))
* Display how many merge requests are opened for the given project+branch ([9215629](https://github.com/brunabxs/gitlab-dashboard/commit/9215629))



<a name="0.0.14"></a>
## [0.0.14](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.13...v0.0.14) (2017-09-26)


### Bug Fixes

* Remove package-lock.json from git ([7e03f32](https://github.com/brunabxs/gitlab-dashboard/commit/7e03f32))


### Features

* Load public, private and internal projects ([91c37a5](https://github.com/brunabxs/gitlab-dashboard/commit/91c37a5))
* Show the namespace in project's name ([345c3a9](https://github.com/brunabxs/gitlab-dashboard/commit/345c3a9))



<a name="0.0.13"></a>
## [0.0.13](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.12...v0.0.13) (2017-08-31)


### Bug Fixes

* Package icons ([aff0943](https://github.com/brunabxs/gitlab-dashboard/commit/aff0943))



<a name="0.0.12"></a>
## [0.0.12](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.11...v0.0.12) (2017-08-12)


### Features

* Allow user to select which projects should be visible in dashboard in options page ([fe30c55](https://github.com/brunabxs/gitlab-dashboard/commit/fe30c55))



<a name="0.0.11"></a>
## [0.0.11](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.10...v0.0.11) (2017-08-04)


### Bug Fixes

* Add CHANGELOG.md and package.json files to commit ([6aa677f](https://github.com/brunabxs/gitlab-dashboard/commit/6aa677f))
* Insert TravisCI git user to allow Travis release the product ([1f37f3d](https://github.com/brunabxs/gitlab-dashboard/commit/1f37f3d))


### Features

* Load merge request information on demand ([d37b9b2](https://github.com/brunabxs/gitlab-dashboard/commit/d37b9b2))
* Load pipeline information on demand ([8dd505b](https://github.com/brunabxs/gitlab-dashboard/commit/8dd505b))
* Remove projects that no longer exists from view ([c812cf0](https://github.com/brunabxs/gitlab-dashboard/commit/c812cf0))



<a name="0.0.10"></a>
## [0.0.10](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.9...v0.0.10) (2017-07-14)


### Features

* Use JSHint
* Add CHANGELOG.md file
* Add bump to manage package.json version
* Add conventional changelog to update the CHANGELOG.md file. See [How to standardize commit message](https://conventionalcommits.org/) to learn more.



<a name="v0.0.9"></a>
##  [0.0.9](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.8...v0.0.9) (2017-07-14)


### Features

* Improve processes of project, pipeline and merge requests retrieval
* Dashboard now updates automatically, given a refresh rate (in seconds)



<a name="v0.0.8"></a>
##  [0.0.8](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.7...v0.0.8) (2017-07-14)


### Features

* Use the chrome extension options page to define GitLab information
* Change the project's pipeline selection method 



<a name="v0.0.7"></a>
##  [0.0.7](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.6...v0.0.7) (2017-07-12)


### Features

* Use KnockoutJS to handle the dashboard interface
* Improve project and merge request information on dashboard
* Show project's pipeline information on dashboard



<a name="v0.0.6"></a>
##  [0.0.6](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.5...v0.0.6) (2017-07-02)


### Features

* Show project and merge request information on dashboard
* Use chrome extension background page instead of a pop-up to show the dashboard
* Improve interface



<a name="v0.0.5"></a>
##  [0.0.5](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.4...v0.0.5) (2017-07-02)


### Bug Fixes

* Fix "code redeemed" error during publish process



<a name="v0.0.4"></a>
##  [0.0.4](https://github.com/brunabxs/gitlab-dashboard/compare/v0.0.1...v0.0.4) (2017-07-02)


### Bug Fixes

* Fix build and publish processes



<a name="v0.0.1"></a>
## v0.0.1 (2017-06-30)


### Features

* Initial version with only very basic features
* Use JQuery and Underscore to create the first interface
* Create icons for the project
* Automate build and publish processes
