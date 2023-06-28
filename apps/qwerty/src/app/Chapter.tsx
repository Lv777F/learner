import { Cell, Row, Table, Tbody, Thead } from '@learner/daisy-solid';
import { VoidProps, from } from 'solid-js';
import { currentChapter$$, getChapters } from '../service/chapters';

function Chapter(props: VoidProps<{ dictName: string }>) {
  const chapters = from(getChapters(props.dictName));

  return (
    <Table
      pin-rows
      data={chapters}
      onSelect={(chapter) => currentChapter$$.next(chapter ?? 0)}
      defaultSelected={currentChapter$$.value}
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
            <Cell>{() => row + 1}</Cell>
          </Row>
        )}
      </Tbody>
    </Table>
  );
}

export default Chapter;
