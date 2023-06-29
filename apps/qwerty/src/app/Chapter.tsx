import { Cell, Row, Table, Tbody, Thead } from '@learner/daisy-solid';
import { map, switchMap } from 'rxjs';
import { from } from 'solid-js';
import { getChapters } from '../service/chapters';
import { getDictConfig, updateDictConfig } from '../service/configs';
import { currentDict$$ } from '../service/dicts';

function Chapter() {
  const chapters = from(currentDict$$.pipe(switchMap(getChapters)));

  const currentChapter = from(
    currentDict$$.pipe(
      switchMap(getDictConfig),
      map(({ currentChapter: currentChapter }) => currentChapter)
    )
  );

  return (
    <Table
      pin-rows
      data={chapters}
      onSelect={(chapter) =>
        updateDictConfig(currentDict$$.value, {
          currentChapter: chapter,
        }).subscribe()
      }
      selected={currentChapter}
    >
      <Thead>
        <Row>
          <Cell head>{() => '章节'}</Cell>
        </Row>
      </Thead>
      <Tbody>
        {(row: number) => (
          <Row
            selectable
            onSelected={(el) => el.scrollIntoView({ block: 'center' })}
          >
            <Cell class="select-none">{() => row + 1}</Cell>
          </Row>
        )}
      </Tbody>
    </Table>
  );
}

export default Chapter;
