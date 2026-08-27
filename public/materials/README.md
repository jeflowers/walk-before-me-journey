# Materials PDF Files

Place PDF materials for each waypoint in this directory using the naming convention:

```
wp01-facilitator-guide.pdf
wp01-student-handout.pdf
wp01-quick-reference.pdf
wp01-print-study.pdf
wp02-facilitator-guide.pdf
...
wp07-print-study.pdf
```

The app reads the file list from `src/data/materials.ts`. If you add or remove files,
update that config so the waypoint pages show the correct buttons.
